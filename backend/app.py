import os
from contextlib import asynccontextmanager

from typing import Optional

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from services.pdf_parser import extract_text_from_pdf
from services.resume_extractor import clean_resume_text


class ResumeUploadResponse(BaseModel):
	message: str = Field(..., examples=["Resume uploaded successfully"])
	filename: str
	raw_text: str
	cleaned_resume: str


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


@app.get("/health")
def health_check() -> dict[str, str]:
	return {"status": "ok"}


@app.post("/api/resume/upload", response_model=ResumeUploadResponse)
async def upload_resume(file: Optional[UploadFile] = File(default=None)):
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

	return ResumeUploadResponse(
		message="Resume uploaded successfully",
		filename=file.filename,
		raw_text=raw_text,
		cleaned_resume=cleaned_resume,
	)
