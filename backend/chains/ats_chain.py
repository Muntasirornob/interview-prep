from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel
from typing import List
from prompts.promts_reader import read_promts

class ATSResponse(BaseModel):
    ats_score: int
    strengths: List[str]
    weaknesses: List[str]
    missing_keywords: List[str]
    improvements: List[str]
    summary: str


def create_context(resume_text):
    promts = read_promts()
    return f"""
    System Prompt: {promts.get("ats_prompt.md", "")}
    Resume: {resume_text}
    """

def analyze_resume(resume_text: str, llm):
    context = create_context(resume_text)
    prompt = ChatPromptTemplate.from_messages([("human", context)])
    print(prompt)
    response = llm.predict_messages([prompt])
    return response