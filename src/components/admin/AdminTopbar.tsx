
import { Link, useLocation } from 'react-router-dom'

const pageTitles: Record<string, string> = {
  '/admin': 'Overview',
  '/admin/topics': 'Manage topics',
  '/admin/content': 'Content editor',
  '/admin/categories': 'Categories',
  '/admin/learning-path': 'Learning path',
}

export default function AdminTopbar() {
  const { pathname } = useLocation()
  const pageTitle = pageTitles[pathname] ?? 'Administration'

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-breadcrumbs">
        <Link to="/admin">Admin</Link>
        <span>/</span>
        <strong>{pageTitle}</strong>
      </div>

      <div className="admin-topbar-right">
        <span className="admin-topbar-status-dot" />
        <span>Admin mode</span>

        <Link
          to="/"
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
          <span>↗</span>
          User View
        </Link>

        <div className="admin-topbar-avatar">A</div>
      </div>
    </header>
  )
}
