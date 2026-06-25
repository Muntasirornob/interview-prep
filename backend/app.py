import os
from contextlib import asynccontextmanager
from uuid import uuid4

from typing import Optional

from fastapi import FastAPI, File, HTTPException, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

from chains.ats_chain import ATSResponse, analyze_resume 
from chains.format_chain import format_resume_chain
from chains.rewrite_chain import rewrite_resume_chain
from chains.skills_chain import ResumeSkillExtractionResponse, extract_skills_from_resume_chain
from services.pdf_parser import extract_text_from_pdf
from services.resume_extractor import clean_resume_text


import os
from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env file

SESSION_COOKIE_NAME = os.getenv("SESSION_COOKIE_NAME", "resume_session_id")
SESSION_STORE: dict[str, dict] = {}

llm= ChatOpenAI(
    model_name=os.getenv("OPENAI_API_MODEL", "gpt-4o"),
    temperature=0,
    max_tokens=5000,
    openai_api_key=os.getenv("OPENAI_API_KEY")      
)   


class ResumeUploadResponse(BaseModel):
	message: str = Field(..., examples=["Resume uploaded successfully"])
	filename: str
	raw_text: str
	cleaned_resume: str
	skills: list[str] = Field(default_factory=list)


class ATSAnalyzeRequest(BaseModel):
	cleaned_text: str = Field(..., min_length=1)


class ATSAnalyzeResponse(BaseModel):
	success: bool
	ats_score: int
	strengths: list[str]
	weaknesses: list[str]
	missing_keywords: list[str]

class ResumeRewriteRequest(BaseModel):
	job_role: str = Field(..., min_length=1)
	job_description: str = Field(..., min_length=1)
	cleaned_resume: Optional[str] = None
	skills: list[str] = Field(default_factory=list)
	ats_analysis: Optional[dict] = None


def parse_cors_origins() -> list[str]:
	raw_value = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
	return [origin.strip() for origin in raw_value.split(",") if origin.strip()]


@asynccontextmanager
async def lifespan(app: FastAPI):
	yield


app = FastAPI(
	title="Resume Upload API",
	description="API for uploading PDF resumes and returning cleaned resume text.",
	version="1.0.0",
	lifespan=lifespan,
)

app.add_middleware(
	CORSMiddleware,
	allow_origins=parse_cors_origins(),
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


@app.middleware("http")
async def session_middleware(request: Request, call_next):
	session_id = request.cookies.get(SESSION_COOKIE_NAME)
	if not session_id or session_id not in SESSION_STORE:
		session_id = str(uuid4())
		SESSION_STORE[session_id] = {}

	request.state.session = SESSION_STORE[session_id]
	response = await call_next(request)
	response.set_cookie(
		key=SESSION_COOKIE_NAME,
		value=session_id,
		httponly=True,
		samesite="lax",
	)
	return response


@app.get("/health")
def health_check() -> dict[str, str]:
	return {"status": "ok"}


@app.post("/api/resume/upload", response_model=ResumeUploadResponse)
async def upload_resume(request: Request, file: Optional[UploadFile] = File(default=None)):
	if file is None:
		raise HTTPException(status_code=400, detail="Missing file. Please upload a PDF resume.")

	if not file.filename:
		raise HTTPException(status_code=400, detail="Missing file name.")

	is_pdf_filename = file.filename.lower().endswith(".pdf")
	is_pdf_content_type = file.content_type == "application/pdf"

	if not is_pdf_filename and not is_pdf_content_type:
		raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF file.")

	try:
		pdf_bytes = await file.read()
		raw_text = extract_text_from_pdf(pdf_bytes)
	except Exception as exc:
		raise HTTPException(status_code=422, detail=f"PDF parsing failed: {exc}") from exc

	if not raw_text.strip():
		raise HTTPException(status_code=422, detail="PDF parsing failed: no text could be extracted from the file.")

	try:
		cleaned_resume = clean_resume_text(raw_text)
	except Exception as exc:
		raise HTTPException(status_code=500, detail=f"Resume extraction failed: {exc}") from exc

	if not cleaned_resume:
		raise HTTPException(status_code=422, detail="Resume extraction failed: cleaned resume text is empty.")

	try:
		skills_chain = extract_skills_from_resume_chain(cleaned_resume, llm)
		skills_result = skills_chain.invoke({"resume_text": cleaned_resume})
	except Exception as exc:
		raise HTTPException(status_code=500, detail=f"Skills extraction failed: {exc}") from exc

	if isinstance(skills_result, ResumeSkillExtractionResponse):
		skills_payload = skills_result.model_dump()
	else:
		skills_payload = ResumeSkillExtractionResponse.model_validate(skills_result).model_dump()

	skills_list = skills_payload.get("skills_flat_list", [])
	request.state.session["cleaned_resume"] = cleaned_resume
	request.state.session["skills"] = skills_list

	return ResumeUploadResponse(
		message="Resume uploaded successfully",
		filename=file.filename,
		raw_text=raw_text,
		cleaned_resume=cleaned_resume,
		skills=skills_list,
	)


@app.post("/resume-analyze", response_model=ATSAnalyzeResponse)
def resume_analyze(request: Request, payload: ATSAnalyzeRequest):
	if not payload.cleaned_text.strip():
		raise HTTPException(status_code=400, detail="cleaned_text is required.")

	try:
		result =analyze_resume(payload.cleaned_text, llm)
	except ValueError as exc:
		raise HTTPException(status_code=422, detail=str(exc)) from exc
	except Exception as exc:
		raise HTTPException(status_code=500, detail=f"ATS analysis failed: {exc}") from exc

	if isinstance(result, ATSResponse):
		analysis = result
	else:
		analysis = ATSResponse.model_validate(result)

	request.state.session["ats_analysis"] = analysis.model_dump()

	return ATSAnalyzeResponse(
		success=True,
		ats_score=analysis.ats_score,
		strengths=analysis.strengths,
		weaknesses=analysis.weaknesses,
		missing_keywords=analysis.missing_keywords,
	)





@app.post("/resume-rewrite")
def resume_rewrite(request: Request, payload: ResumeRewriteRequest):
	session = request.state.session

	cleaned_resume = payload.cleaned_resume or session.get("cleaned_resume")
	skills = payload.skills or session.get("skills")
	ats_analysis = payload.ats_analysis or session.get("ats_analysis")

	if not cleaned_resume:
		raise HTTPException(status_code=400, detail="cleaned_resume is missing from session.")
	if not skills:
		raise HTTPException(status_code=400, detail="skills are missing from session.")
	if not ats_analysis:
		raise HTTPException(status_code=400, detail="ats_analysis is missing from session.")

	rewritten_resume = rewrite_resume_chain(
		cleaned_resume,
		ats_analysis,
		skills,
		payload.job_role,
		payload.job_description,
		llm,
	)

	html_output = format_resume_chain(rewritten_resume, llm)
	request.state.session["rewritten_resume"] = rewritten_resume.model_dump() if hasattr(rewritten_resume, "model_dump") else rewritten_resume
	return HTMLResponse(content=html_output, media_type="text/html")



