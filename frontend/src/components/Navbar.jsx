import { NavLink } from 'react-router-dom'
import '../styles/Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <span className="navbar-logo">JobBoard</span>
        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Browse Jobs
          </NavLink>
          <NavLink to="/post" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Post a Job
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
