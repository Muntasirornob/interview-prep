import JobDescriptionForm from '../components/JobDescriptionForm'
import './JobDescriptionPage.css'

function JobDescription({ onBack, onSubmit }) {
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

        <JobDescriptionForm onSubmit={onSubmit} onBack={onBack} />
      </section>
    </main>
  )
}

export default JobDescription