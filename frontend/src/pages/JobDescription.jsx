import { useState } from 'react'
import { useNavigate } from 'react-router'
import JobDescriptionForm from '../components/JobDescriptionForm'
import './JobDescriptionPage.css'

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
}

function JobDescription() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleBack = () => navigate('/')

  const handleSubmit = async (payload) => {
    const uploadData = JSON.parse(window.localStorage.getItem('resume_upload_data') || '{}')
    const atsData = JSON.parse(window.localStorage.getItem('resume_ats_data') || '{}')

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`${getApiBaseUrl()}/resume-rewrite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          job_role: payload.job_title,
          job_description: payload.job_description,
          cleaned_resume: uploadData.cleaned_resume,
          skills: uploadData.skills || [],
          ats_analysis: atsData,
        }),
      })

      const html = await response.text()

      if (!response.ok) {
        throw new Error(html || 'Resume rewrite failed. Please try again.')
      }

      window.localStorage.setItem('resume_preview_html', html)
      navigate('/preview')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Resume rewrite failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="job-description-shell min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <section className="job-description-card home-card mx-auto w-full max-w-3xl rounded-[2rem] border border-white/70 bg-white/80 px-5 py-10 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:px-8 sm:py-14">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.32em] text-sky-600">Job Description</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Prepare Resume Payload
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Add the job title and description, then rewrite the resume and preview the HTML output.
          </p>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-left text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <JobDescriptionForm onSubmit={handleSubmit} onBack={handleBack} isSubmitting={isSubmitting} />
      </section>
    </main>
  )
}

export default JobDescription