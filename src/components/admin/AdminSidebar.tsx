import { NavLink, Link } from 'react-router-dom'

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <Link className="admin-brand" to="/admin">
        <span className="admin-brand-mark">c</span>
        <span>
          <strong>cptncc</strong>
          <small>content management</small>
        </span>
      </Link>

      <div className="admin-sidebar-label">ADMINISTRATION</div>
      <nav className="admin-navigation" aria-label="Admin navigation">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="admin-nav-icon">⌂</span>
          Overview
        </NavLink>
      </nav>

      <div className="admin-sidebar-label admin-sidebar-spaced">CONTENT MANAGEMENT</div>
      <nav className="admin-navigation" aria-label="Content management">
        <NavLink
          to="/admin/topics"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="admin-nav-icon">▤</span>
          Topics
        </NavLink>
        <NavLink
          to="/admin/content"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="admin-nav-icon">▣</span>
          Content editor
          <span className="admin-nav-soon">SOON</span>
        </NavLink>
        <NavLink
          to="/admin/categories"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="admin-nav-icon">▦</span>
          Categories
          <span className="admin-nav-soon">SOON</span>
        </NavLink>
        <NavLink
          to="/admin/learning-path"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="admin-nav-icon">◇</span>
          Learning path
          <span className="admin-nav-soon">SOON</span>
        </NavLink>
      </nav>

      <div className="admin-sidebar-bottom">
        <div className="admin-sidebar-avatar">AD</div>
        <div>
          <strong>Admin workspace</strong>
          <small>Content administrator</small>
        </div>
        <span className="admin-sidebar-menu">···</span>
      </div>
    </aside>
  )
}
