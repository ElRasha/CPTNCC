
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

        <Link
          to="/admin"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            marginLeft: '12px',
            padding: '8px 13px',
            border: '1px solid #e4ddff',
            borderRadius: '9px',
            background: '#f7f5ff',
            color: '#7058df',
            fontSize: '10px',
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
        >
          <span>⚙</span>
          Admin View
        </Link>

        <div className="top-avatar">C</div>
      </div>
    </header>
  )
}
