# Interview Prep — Resume Analyzer

AI-powered resume rewriter. Upload a PDF resume, run ATS analysis, add a job description, and get a tailored HTML resume.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, React Router v7 |
| Backend | FastAPI, LangChain, OpenAI GPT-4o |

## Prerequisites

- Node.js 18+
- Python 3.11+
- OpenAI API key

## Setup

**Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

Create `backend/.env`:
```
OPENAI_API_KEY=sk-...
```

**Frontend**
```bash
cd frontend
npm install
```

## Running

```bash
# Backend
cd backend && uvicorn app:app --reload

# Frontend (separate terminal)
cd frontend && npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:8000

## Flow

1. Upload PDF resume
2. Edit cleaned text → run ATS analysis
3. Add job title + description
4. Preview and download rewritten HTML resume
