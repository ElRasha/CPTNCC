
import { Link, useLocation } from 'react-router-dom'

export default function Topbar() {
  const location = useLocation()
  const path = location.pathname
  const segments = path.split('/').filter(Boolean)

  let pageName = 'Dashboard'

  if (segments[0] === 'roadmap') {
    pageName = 'Roadmap'
  } else if (segments[0] === 'topics') {
    pageName = segments.length > 1 ? 'Topic Details' : 'Topics'
  }

  return (
    <header className="topbar">
      <div className="breadcrumbs">
        <Link to="/">Workspace</Link>
        <span>/</span>
        <strong>{pageName}</strong>
      </div>

      <div className="topbar-right">
        <span className="online-dot" />
        <span>Learning mode</span>
        <div className="top-avatar">C</div>
      </div>
    </header>
  )
}
