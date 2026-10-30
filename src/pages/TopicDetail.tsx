
import { useNavigate } from 'react-router-dom'
import type { Topic } from '../data/topics'
import './TopicDetail.css'

type TopicDetailProps = {
  topic: Topic
  onToggleCompleted: (id: number) => void
}

export default function TopicDetail({
  topic,
  onToggleCompleted,
}: TopicDetailProps) {
  const navigate = useNavigate()

  const statusLabels: Record<Topic['status'], string> = {
    completed: 'Completed',
    learning: 'Learning',
    available: 'Available',
    locked: 'Locked',
  }

  return (
    <div className="topic-detail-page">
      <button
        className="detail-back-button"
        onClick={() => navigate('/topics')}
      >
        <span>←</span> Back to Topics
      </button>

      <div className="detail-breadcrumb">
        Topics <span>/</span> {topic.category} <span>/</span>{' '}
        <strong>{topic.title}</strong>
      </div>

      <section className="detail-hero">
        <span className="detail-eyebrow">{topic.category}</span>

        <h1>{topic.title}</h1>

        <p>{topic.description}</p>

        <div className="detail-badges">
          <span className="detail-badge">{topic.difficulty}</span>
          <span
            className={`detail-badge detail-badge--${topic.status}`}
          >
            {statusLabels[topic.status]}
          </span>
        </div>

        <button
          className="detail-start-button"
          onClick={() => {
            if (topic.status !== 'completed') {
              onToggleCompleted(topic.id)
            }
          }}
        >
          {topic.status === 'completed'
            ? '✓ Completed'
            : 'Mark as completed'}
        </button>
      </section>

      <div className="detail-content-grid">
        <section className="detail-main-card">
          <span className="detail-section-eyebrow">OVERVIEW</span>
          <h2>About this topic</h2>
          <p>{topic.description}</p>

          <div className="detail-coming-soon">
            <span className="detail-coming-soon-icon">✦</span>
            <div>
              <h3>Learning content is coming next</h3>
              <p>
                Halaman ini akan dikembangkan menjadi materi belajar
                lengkap, mulai dari intuisi dan penjelasan konsep,
                contoh langkah demi langkah, implementasi C++, hingga
                latihan soal Competitive Programming.
              </p>
            </div>
          </div>
        </section>

        <aside className="detail-sidebar-card">
          <h2>Learning path</h2>
          <p className="detail-sidebar-description">
            Materi yang perlu kamu pahami sebelum mempelajari topik ini.
          </p>

          {topic.prerequisites.length > 0 ? (
            <div className="detail-prerequisites">
              {topic.prerequisites.map((prerequisite) => (
                <div className="detail-prerequisite" key={prerequisite}>
                  <span className="detail-prerequisite-icon">◇</span>
                  <span>{prerequisite}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="detail-no-prerequisites">
              <span>✓</span>
              Tidak ada prerequisite. Kamu bisa memulai dari sini!
            </div>
          )}

          <button
            className="detail-see-all-button"
            onClick={() => navigate('/topics')}
          >
            Explore all topics <span>→</span>
          </button>
        </aside>
      </div>
    </div>
  )
}
