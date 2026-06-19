import { useState } from 'react'
import '../styles/SearchBar.css'

export default function SearchBar({ onSearch, onClear, loading }) {
  const [query, setQuery] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) onSearch(trimmed)
  }

  function handleClear() {
    setQuery('')
    onClear()
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder="Search by role, skill, or keyword..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button type="button" className="clear-btn" onClick={handleClear} aria-label="Clear search">
          ✕
        </button>
      )}
      <button type="submit" className="search-btn" disabled={loading || !query.trim()}>
        {loading ? 'Searching…' : 'Search'}
      </button>
    </form>
  )
}
