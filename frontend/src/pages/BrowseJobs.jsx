import { useEffect, useState } from 'react'
import { getAllPosts, searchPosts } from '../api/client'
import PostCard from '../components/PostCard'
import SearchBar from '../components/SearchBar'
import '../styles/BrowseJobs.css'

export default function BrowseJobs() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState(null)
  const [searchMode, setSearchMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    setError(null)
    try {
      const res = await getAllPosts()
      setPosts(res.data)
    } catch {
      setError('Could not load job posts. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch(query) {
    setSearching(true)
    setError(null)
    setSearchQuery(query)
    try {
      const res = await searchPosts(query)
      setPosts(res.data)
      setSearchMode(true)
    } catch {
      setError('Search failed. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  async function handleClear() {
    setSearchMode(false)
    setSearchQuery('')
    await fetchAll()
  }

  return (
    <div className="browse-page">
      <div className="browse-hero">
        <h1 className="browse-title">Find Your Next Role</h1>
        <p className="browse-subtitle">Browse open positions or search by skill, role, or keyword.</p>
        <SearchBar onSearch={handleSearch} onClear={handleClear} loading={searching} />
      </div>

      <div className="browse-results">
        {searchMode && (
          <p className="results-label">
            {posts.length === 0
              ? `No results for "${searchQuery}"`
              : `${posts.length} result${posts.length > 1 ? 's' : ''} for "${searchQuery}"`}
          </p>
        )}

        {!searchMode && !loading && (
          <p className="results-label">{posts.length} open position{posts.length !== 1 ? 's' : ''}</p>
        )}

        {error && <p className="error-msg">{error}</p>}

        {(loading || searching) && (
          <div className="cards-grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="post-card skeleton" />
            ))}
          </div>
        )}

        {!loading && !searching && posts.length > 0 && (
          <div className="cards-grid">
            {posts.map((post, i) => (
              <PostCard key={i} post={post} />
            ))}
          </div>
        )}

        {!loading && !searching && !error && posts.length === 0 && (
          <div className="empty-state">
            <p className="empty-icon">📭</p>
            <p className="empty-text">No job posts found.</p>
            {searchMode && (
              <button className="empty-clear-btn" onClick={handleClear}>
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
