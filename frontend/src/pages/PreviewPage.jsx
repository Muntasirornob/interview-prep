import { useNavigate } from 'react-router'

function PreviewPage() {
  const navigate = useNavigate()
  const previewHtml = window.localStorage.getItem('resume_preview_html') || ''

  const handleDownload = () => {
    const blob = new Blob([previewHtml], { type: 'text/html;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'rewritten-resume.html'
    link.click()

    window.URL.revokeObjectURL(url)
  }

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

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/job-description')}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Download HTML
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
          <iframe title="Rewritten resume preview" srcDoc={previewHtml} className="h-[80vh] w-full" />
        </div>
      </section>
    </main>
  )
}

export default PreviewPage
