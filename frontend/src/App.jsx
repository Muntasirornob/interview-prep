import { useState } from 'react'
import Home from './pages/Home'
import JobDescriptionPage from './pages/JobDescriptionPage'

function App() {
  const [page, setPage] = useState('home')
  const [jobDescriptionPayload, setJobDescriptionPayload] = useState(null)

  if (page === 'job-description') {
    return (
      <JobDescriptionPage
        onBack={() => setPage('home')}
        onSubmit={(payload) => {
          setJobDescriptionPayload(payload)
          setPage('home')
        }}
        savedPayload={jobDescriptionPayload}
      />
    )
  }

  return <Home onGoToJobDescription={() => setPage('job-description')} />
}

export default App
