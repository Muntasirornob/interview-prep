import { useState } from 'react'
import Home from './pages/Home'
import JobDescription from './pages/JobDescription'

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
}

function App() {
  const [page, setPage] = useState('home')
  const [previewHtml, setPreviewHtml] = useState('')

  const handleDownloadResume = () => {
    const blob = new Blob([previewHtml], { type: 'text/html;charset=utf-8' })
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = downloadUrl
    link.download = 'rewritten-resume.html'
    link.click()

    window.URL.revokeObjectURL(downloadUrl)
  }

  const handleRewriteResume = async (payload) => {
    const uploadData = JSON.parse(window.localStorage.getItem('resume_upload_data') || '{}')
    const atsData = JSON.parse(window.localStorage.getItem('resume_ats_data') || '{}')

    const response = await fetch(`${getApiBaseUrl()}/resume-rewrite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        job_role: payload.job_title,
        job_description: payload.job_description,
        cleaned_resume: uploadData.cleaned_resume,
        skills: uploadData.skills || [],
        ats_analysis: atsData,
      }),
    })

    const responseData = await response.text()

    if (!response.ok) {
      throw new Error(responseData || 'Resume rewrite failed. Please try again.')
    }

    setPreviewHtml(responseData)
    setPage('preview')
  }

  if (page === 'job-description') {
    return (
      <JobDescription
        onBack={() => setPage('home')}
        onSubmit={handleRewriteResume}
      />
    )
  }

  if (page === 'preview') {
    return (
      <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-5 rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.32em] text-sky-600">Preview</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Rewritten Resume
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setPage('job-description')}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleDownloadResume}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Download HTML
            </button>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
            <iframe title="Rewritten resume preview" srcDoc={previewHtml} className="h-[80vh] w-full" />
          </div>
        </section>
      </main>
    )
  }

  return <Home onGoToJobDescription={() => setPage('job-description')} />
}

export default App
