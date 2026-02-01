import React from 'react'
import { NavLink } from 'react-router-dom'
import '../styles/bottom-nav.css'

const BottomNav = () => {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Bottom">
      <div className="bottom-nav__inner">
        <NavLink to="/explore" end className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <span className="bottom-nav__icon" aria-hidden="true">
            {/* home icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10.5 12 3l9 7.5" />
              <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />
            </svg>
          </span>
          <span className="bottom-nav__label">Explore</span>
        </NavLink>

        <NavLink to="/annapurna" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <span className="bottom-nav__icon" aria-hidden="true">
            {/* heart-handshake icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.28 3.6-2.35 4.57-2.74a2 2 0 0 0 1.25-2.57l-1.38-5.66a2 2 0 0 0-3.5-.66l-3.11 4.66a2 2 0 0 1-2.22.66l-3.23-1.08a2 2 0 0 0-2.23.41L5.3 10.8a2 2 0 0 0-1.3 1.87v6.86a2 2 0 0 0 1.5 1.94l6.09 1.96a2 2 0 0 0 1.83-.43l4.58-3.95" />
              <path d="M11 18a6 6 0 0 1 11.93-1.73" />
            </svg>
          </span>
          <span className="bottom-nav__label">Annapurna</span>
        </NavLink>

        <NavLink to="/saved" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <span className="bottom-nav__icon" aria-hidden="true">
            {/* bookmark icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
            </svg>
          </span>
          <span className="bottom-nav__label">Saved</span>
        </NavLink>
      </div>
    </nav>
  )
}

export default BottomNav
