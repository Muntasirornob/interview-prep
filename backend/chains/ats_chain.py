import os
from typing import List

from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel

from promts.promts_reader import get_ats_prompt 



class ATSResponse(BaseModel):
    ats_score: int
    strengths: List[str]
    weaknesses: List[str]
    missing_keywords: List[str]
    improvements: List[str]
    summary: str


def create_context(resume_text: str) -> str:
    return get_ats_prompt()
    


def analyze_resume(resume_text: str, llm):
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", create_context(resume_text)),
            ("human", "Resume: {resume_text}"),
        ]
    )
    structured_llm = llm.with_structured_output(ATSResponse)
    chain = prompt | structured_llm
    return chain.invoke({"resume_text": resume_text})


