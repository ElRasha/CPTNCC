
import { NavLink } from 'react-router-dom'

type SidebarProps = {
  completedCount: number
  totalTopics: number
}

export default function Sidebar({
  completedCount,
  totalTopics,
}: SidebarProps) {
  const progress =
    totalTopics === 0
      ? 0
      : Math.round((completedCount / totalTopics) * 100)

  return (
    <aside className="sidebar">
      <NavLink className="brand" to="/">
        <span className="brand-mark">c</span>
        <span>
          <strong>cptncc</strong>
          <small>your CP learning map</small>
        </span>
      </NavLink>

      <div className="sidebar-label">WORKSPACE</div>

      <nav className="navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`
          }
        >
          <span>⌘</span> Dashboard
        </NavLink>

        <NavLink
          to="/topics"
          className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`
          }
        >
          <span>▤</span> Topics
        </NavLink>

        <NavLink
          to="/roadmap"
          className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`
          }
        >
          <span>◇</span> Roadmap
        </NavLink>

        <button
          className="nav-item"
          onClick={() => alert('Halaman Progress akan dibuat berikutnya!')}
        >
          <span>◷</span> My progress
        </button>

        <button
          className="nav-item"
          onClick={() => alert('AI Coach akan dibuat pada tahap berikutnya!')}
        >
          <span>✳</span> AI coach
          <span className="soon-label">SOON</span>
        </button>
      </nav>

      <div className="sidebar-label roadmap-label">YOUR LEARNING</div>

      <div className="mini-progress">
        <div className="mini-progress-heading">
          <span>Overall progress</span>
          <strong>{progress}%</strong>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <small>
          {completedCount} of {totalTopics} topics completed
        </small>
      </div>

      <div className="sidebar-bottom">
        <div className="avatar">CP</div>
        <div className="profile-text">
          <strong>My workspace</strong>
          <small>Personal learning</small>
        </div>
        <span className="profile-menu">···</span>
      </div>
    </aside>
  )
}
