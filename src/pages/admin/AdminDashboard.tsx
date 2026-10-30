
import { Link } from 'react-router-dom'
import type { Topic } from '../../data/topics'
import '../../styles/admin/AdminDashboard.css'

type AdminDashboardProps = {
  topics: Topic[]
}

export default function AdminDashboard({
  topics,
}: AdminDashboardProps) {
  const categories = [...new Set(topics.map((topic) => topic.category))]
  const stages = [...new Set(topics.map((topic) => topic.stage))].sort(
    (a, b) => a - b,
  )

  const completed = topics.filter(
    (topic) => topic.status === 'completed',
  ).length

  const learning = topics.filter(
    (topic) => topic.status === 'learning',
  ).length

  const available = topics.filter(
    (topic) => topic.status === 'available',
  ).length

  const recentTopics = [...topics].sort((a, b) => a.id - b.id).slice(0, 6)

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <div className="admin-breadcrumb">
            CPTNCC <span>/</span> Admin
          </div>
          <h1>Admin Dashboard</h1>
          <p>
            Kelola topik, materi pembelajaran, dan learning path CPTNCC.
          </p>
        </div>

        <div className="admin-header-actions">
          <span className="admin-role">
            <span className="admin-role-dot" />
            Admin workspace
          </span>
        </div>
      </div>

      <section className="admin-welcome">
        <div className="admin-welcome-content">
          <span className="admin-eyebrow">CONTENT MANAGEMENT</span>
          <h2>Welcome to CPTNCC Admin</h2>
          <p>
            Semua yang dibutuhkan untuk mengelola pengalaman belajar
            competitive programming ada di satu tempat.
          </p>
          <Link to="/admin/topics" className="admin-primary-button">
            Manage topics <span>→</span>
          </Link>
        </div>

        <div className="admin-welcome-visual">
          <div className="admin-visual-card visual-card-back">
            <span>01</span>
            <div />
            <div />
          </div>
          <div className="admin-visual-card visual-card-front">
            <span className="visual-code-icon">{'{ }'}</span>
            <strong>Learn. Build. Solve.</strong>
            <small>Competitive programming</small>
          </div>
          <div className="admin-visual-orbit orbit-one" />
          <div className="admin-visual-orbit orbit-two" />
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-heading">
          <div>
            <h2>Content overview</h2>
            <p>Ringkasan struktur materi CPTNCC saat ini.</p>
          </div>
        </div>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span>Total topics</span>
              <span className="admin-stat-icon purple">▤</span>
            </div>
            <strong>{topics.length}</strong>
            <small>Topik terdaftar</small>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span>Categories</span>
              <span className="admin-stat-icon blue">▦</span>
            </div>
            <strong>{categories.length}</strong>
            <small>Kategori pembelajaran</small>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span>Learning stages</span>
              <span className="admin-stat-icon orange">◇</span>
            </div>
            <strong>{stages.length}</strong>
            <small>Tahapan roadmap</small>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span>Prerequisites</span>
              <span className="admin-stat-icon green">⌘</span>
            </div>
            <strong>
              {topics.reduce(
                (total, topic) => total + topic.prerequisites.length,
                0,
              )}
            </strong>
            <small>Relasi prasyarat topik</small>
          </div>
        </div>
      </section>

      <section className="admin-content-grid">
        <div className="admin-panel admin-topics-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Topics</h2>
              <p>Topik yang sudah terdaftar di CPTNCC.</p>
            </div>
            <Link to="/admin/topics" className="admin-text-link">
              View all <span>→</span>
            </Link>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Category</th>
                  <th>Stage</th>
                  <th>Progress status</th>
                </tr>
              </thead>
              <tbody>
                {recentTopics.map((topic) => (
                  <tr key={topic.id}>
                    <td>
                      <div className="admin-topic-name">
                        <span className="admin-topic-number">
                          {String(topic.id).padStart(2, '0')}
                        </span>
                        <strong>{topic.title}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="admin-category">
                        {topic.category}
                      </span>
                    </td>
                    <td>
                      <span className="admin-stage">
                        Stage {topic.stage}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-status ${topic.status}`}>
                        <span />
                        {topic.status === 'completed'
                          ? 'Completed'
                          : topic.status === 'learning'
                            ? 'Learning'
                            : 'Available'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-side-column">
          <div className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Quick access</h2>
                <p>Akses fitur pengelolaan.</p>
              </div>
            </div>

            <div className="admin-quick-links">
              <Link to="/admin/topics" className="admin-quick-link">
                <span className="quick-link-icon purple">▤</span>
                <span>
                  <strong>Manage topics</strong>
                  <small>Tambah dan edit topik</small>
                </span>
                <span className="quick-arrow">→</span>
              </Link>

              <Link to="/admin/content" className="admin-quick-link">
                <span className="quick-link-icon blue">▣</span>
                <span>
                  <strong>Content editor</strong>
                  <small>Susun materi dengan blocks</small>
                </span>
                <span className="quick-arrow">→</span>
              </Link>

              <Link to="/admin/categories" className="admin-quick-link">
                <span className="quick-link-icon orange">▦</span>
                <span>
                  <strong>Categories</strong>
                  <small>Kelola kategori topik</small>
                </span>
                <span className="quick-arrow">→</span>
              </Link>

              <Link to="/admin/learning-path" className="admin-quick-link">
                <span className="quick-link-icon green">◇</span>
                <span>
                  <strong>Learning path</strong>
                  <small>Atur prerequisite</small>
                </span>
                <span className="quick-arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="admin-panel admin-progress-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Topic progress</h2>
                <p>Status belajar yang tersimpan saat ini.</p>
              </div>
            </div>

            <div className="admin-progress-item">
              <div>
                <span>Completed</span>
                <strong>{completed}</strong>
              </div>
              <div className="admin-mini-track">
                <div
                  className="completed-fill"
                  style={{
                    width: `${topics.length ? (completed / topics.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="admin-progress-item">
              <div>
                <span>Learning</span>
                <strong>{learning}</strong>
              </div>
              <div className="admin-mini-track">
                <div
                  className="learning-fill"
                  style={{
                    width: `${topics.length ? (learning / topics.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="admin-progress-item">
              <div>
                <span>Available</span>
                <strong>{available}</strong>
              </div>
              <div className="admin-mini-track">
                <div
                  className="available-fill"
                  style={{
                    width: `${topics.length ? (available / topics.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="admin-footer-note">
        <span>ⓘ</span>
        <p>
          Ini adalah tampilan awal Admin Dashboard. Perubahan konten belum
          disimpan ke database dan belum memengaruhi halaman belajar.
        </p>
      </div>
    </div>
  )
}
