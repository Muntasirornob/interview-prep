import { Navigate, Route, Routes } from 'react-router'
import Home from '../pages/Home'
import JobDescription from '../pages/JobDescription'
import PreviewPage from '../pages/PreviewPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/job-description" element={<JobDescription />} />
      <Route path="/preview" element={<PreviewPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
