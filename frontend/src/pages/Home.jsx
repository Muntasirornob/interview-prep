import FileUpload from '../components/FileUpload'
import './Home.css'

function Home() {
  return (
    <main className="home-shell min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <section className="home-card mx-auto flex w-full max-w-3xl flex-col items-center rounded-[2rem] border border-white/70 bg-white/80 px-5 py-10 text-center shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:px-8 sm:py-14">
        <p className="text-sm font-medium uppercase tracking-[0.32em] text-sky-600">Resume Upload</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Upload your resume in seconds
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Select a PDF resume or drag it into the upload area below. The interface keeps the flow simple,
          responsive, and easy to scan.
        </p>

        <div className="mt-8 w-full">
          <FileUpload />
        </div>
      </section>
    </main>
  )
}

export default Home