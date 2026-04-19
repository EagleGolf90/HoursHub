import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import BusinessHours from './components/BusinessHours'
import BusinessHoursManager from './components/BusinessHoursManager'
import BusinessDirectory from './components/BusinessDirectory'

function App()
{
  return (
    <>
      <nav className="app-nav">
        <div className="nav-container">
          <h1 className="app-title">🕐 Hours Hub</h1>
          <div className="nav-actions">
            <div className="nav-buttons" role="navigation" aria-label="Primary">
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to="/businesses"
              >
                Business
              </NavLink>
            </div>
            <NavLink
              className={({ isActive }) => `nav-cta ${isActive ? 'active' : ''}`}
              to="/manage"
            >
              Manage Hours
            </NavLink>
          </div>
        </div>
      </nav>

      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/businesses" replace />} />
          <Route path="/businesses" element={<BusinessDirectory />} />
          <Route path="/businesses/:locationId" element={<BusinessHours />} />
          <Route path="/manage" element={<BusinessHoursManager />} />
          <Route path="*" element={<Navigate to="/businesses" replace />} />
        </Routes>
      </div>
    </>
  )
}

export default App
