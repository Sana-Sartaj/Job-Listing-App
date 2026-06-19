import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import BrowseJobs from './pages/BrowseJobs'
import PostJob from './pages/PostJob'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="page-wrapper">
        <Routes>
          <Route path="/" element={<BrowseJobs />} />
          <Route path="/post" element={<PostJob />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
