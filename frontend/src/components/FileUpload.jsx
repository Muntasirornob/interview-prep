import { useEffect, useRef, useState } from 'react'
import './css/FileUpload.css'

function isPdfFile(file) {
  return file?.type === 'application/pdf' || file?.name?.toLowerCase().endsWith('.pdf')
}

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
}

function FileUpload() {
  const inputRef = useRef(null)
  const dragDepthRef = useRef(0)
  const [selectedFileName, setSelectedFileName] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isToastVisible, setIsToastVisible] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [analysisError, setAnalysisError] = useState('')
  const [resumeData, setResumeData] = useState(null)
  const [analysisData, setAnalysisData] = useState(null)
  const [cleanedText, setCleanedText] = useState('')

  useEffect(() => {
    if (!isToastVisible) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setIsToastVisible(false)
    }, 3000)

    return () => window.clearTimeout(timeoutId)
  }, [isToastVisible])

  const uploadFile = async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    setIsUploading(true)
    setUploadError('')
    setAnalysisError('')
    setAnalysisData(null)
    setResumeData(null)

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/resume/upload`, {
        method: 'POST',
        body: formData,
      })

      const responseData = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(responseData?.detail || 'Upload failed. Please try again.')
      }

      setSelectedFileName(responseData?.filename || file.name)
      setResumeData(responseData)
  setCleanedText(responseData?.cleaned_resume || '')
      setIsToastVisible(true)

      if (inputRef.current) {
        inputRef.current.value = ''
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const triggerSuccess = (file) => {
    uploadFile(file)

  }

  const handleAnalyze = async () => {
    if (!cleanedText.trim()) {
      setAnalysisError('Paste or upload cleaned resume text before analyzing.')
      return
    }

    setIsAnalyzing(true)
    setAnalysisError('')
    setAnalysisData(null)

    try {
      const response = await fetch(`${getApiBaseUrl()}/resume-analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cleaned_text: cleanedText }),
      })

      const responseData = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(responseData?.detail || 'Analysis failed. Please try again.')
      }

      setAnalysisData(responseData)
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFiles = (files) => {
    const [file] = files

    if (!file || !isPdfFile(file)) {
      setUploadError('Please upload a valid PDF file.')
      return
    }

    triggerSuccess(file)
  }

  const handleInputChange = (event) => {
    handleFiles(event.target.files)
  }

  const handleDragOver = (event) => {
    event.preventDefault()

    if (!isDragging) {
      setIsDragging(true)
    }

    dragDepthRef.current += 1
  }

  const handleDragLeave = () => {
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)

    if (dragDepthRef.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    dragDepthRef.current = 0
    handleFiles(event.dataTransfer.files)
  }

  return (
    <div className="relative w-full max-w-2xl">
      <label
        className={`file-upload-dropzone group flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/80 px-6 py-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-sky-400 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] ${isDragging ? 'file-upload-dropzone--active' : ''} ${isUploading ? 'pointer-events-none opacity-80' : ''}`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleInputChange}
          disabled={isUploading}
        />

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 ring-8 ring-sky-50">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4 4 4M4 16.5V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2.5" />
          </svg>
        </div>

        <div className="mt-5 space-y-2">
          <p className="text-lg font-semibold text-slate-900">
            {isUploading ? 'Uploading your resume...' : 'Drag and drop your PDF here'}
          </p>
          <p className="text-sm text-slate-500">
            {isUploading ? 'Please wait while we process the file' : 'or click to browse files from your device'}
          </p>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">PDF only</p>
        </div>

        {selectedFileName ? (
          <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
            <span className="font-medium text-slate-900">Selected file:</span> {selectedFileName}
          </div>
        ) : null}

        {isUploading ? (
          <div className="mt-6 flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-sky-500" />
            Processing resume
          </div>
        ) : null}
      </label>

      {uploadError ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {uploadError}
        </div>
      ) : null}

      <div
        className={`file-upload-toast pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 ${isToastVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
        role="status"
        aria-live="polite"
      >
        Resume uploaded successfully
      </div>

      {resumeData ? (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white/85 p-5 text-left shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">Backend response</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">Cleaned resume ready</h2>
            </div>
            <p className="text-sm text-slate-500">{resumeData.filename}</p>
          </div>

          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Raw text</p>
              <p className="mt-2 rounded-2xl bg-slate-50 p-4 leading-6 text-slate-700">
                {resumeData.raw_text}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Cleaned resume</p>
              <textarea
                value={cleanedText}
                onChange={(event) => setCleanedText(event.target.value)}
                className="mt-2 min-h-48 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white"
                placeholder="Paste cleaned resume text here or edit the uploaded text before analysis"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </button>
            <p className="text-sm text-slate-500">Copy, paste, or edit the cleaned text before running ATS analysis.</p>
          </div>

          {analysisError ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {analysisError}
            </div>
          ) : null}
        </div>
      ) : null}

      {analysisData ? (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white/85 p-5 text-left shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">Analysis Complete</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">ATS evaluation results</h2>
            </div>
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-8 border-emerald-100 bg-emerald-50 text-center shadow-inner">
              <div>
                <div className="text-2xl font-bold text-emerald-700">{analysisData.ats_score}</div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">ATS Score</div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Strengths</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {analysisData.strengths?.map((item, index) => (
                  <li key={`${item}-${index}`} className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Weaknesses</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {analysisData.weaknesses?.map((item, index) => (
                  <li key={`${item}-${index}`} className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Missing Keywords</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {analysisData.missing_keywords?.map((item, index) => (
                  <li key={`${item}-${index}`} className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default FileUpload