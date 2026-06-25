import { useState } from 'react'
import './css/JobDescriptionForm.css'

function JobDescriptionForm({ onSubmit, onBack, isSubmitting = false }) {
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!jobTitle.trim() || !jobDescription.trim()) {
      setError('Job title and job description are required.')
      return
    }

    setError('')
    onSubmit?.({ job_title: jobTitle.trim(), job_description: jobDescription.trim() })
  }

  return (
    <form className="job-description-form mt-8 space-y-5 text-left" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Job Title</label>
        <input
          value={jobTitle}
          onChange={(event) => setJobTitle(event.target.value)}
          className="job-description-input w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-sky-400"
          placeholder="Backend Developer"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Job Description</label>
        <textarea
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          className="job-description-textarea min-h-56 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-sky-400"
          placeholder="Paste the full job description here"
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Rewriting...' : 'Rewrite Resume'}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Back
        </button>
      </div>
    </form>
  )
}

export default JobDescriptionForm