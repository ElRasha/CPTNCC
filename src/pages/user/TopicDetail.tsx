
import { useNavigate } from 'react-router-dom'
import type { Topic } from '../../data/topics'
import '../../styles/user/TopicDetail.css'

type TopicDetailProps = {
  topic: Topic
  topics: Topic[]
  onToggleComplete: (id: number) => void
}

function TopicDetail({
  topic,
  topics,
  onToggleComplete,
}: TopicDetailProps) {
  const navigate = useNavigate()

  const prerequisites = topic.prerequisites
    .map((name) =>
      topics.find(
        (item) => item.title === name || item.slug === name
      )
    )
    .filter((item): item is Topic => item !== undefined)

  const completedPrerequisites = prerequisites.filter(
    (item) => item.status === 'completed'
  ).length

  const isCompleted = topic.status === 'completed'

  const getStatusLabel = (status: Topic['status']) => {
    switch (status) {
      case 'completed':
        return 'Selesai'
      case 'learning':
        return 'Sedang dipelajari'
      default:
        return 'Belum dipelajari'
    }
  }

  const getStatusClass = (status: Topic['status']) => {
    switch (status) {
      case 'completed':
        return 'completed'
      case 'learning':
        return 'learning'
      default:
        return 'available'
    }
  }

  return (
    <div className="topic-detail-page">
      <button
        className="back-button"
        onClick={() => navigate('/topics')}
      >
        <span>←</span> Back to Topics
      </button>

      <div className="topic-breadcrumb">
        <span onClick={() => navigate('/topics')}>Topics</span>
        <span>/</span>
        <span>{topic.category}</span>
        <span>/</span>
        <strong>{topic.title}</strong>
      </div>

      <section className="topic-hero">
        <div className="topic-hero-content">
          <span className="topic-category-label">
            {topic.category}
          </span>

          <h1>{topic.title}</h1>

          <p>{topic.description}</p>

          <div className="topic-tags">
            <span className="topic-tag">
              {topic.difficulty}
            </span>

            <span className={`topic-tag status-${topic.status}`}>
              {getStatusLabel(topic.status)}
            </span>
          </div>

          <button
            className={`complete-button ${isCompleted ? 'is-completed' : ''}`}
            onClick={() => onToggleComplete(topic.id)}
          >
            {isCompleted ? '✓ Completed' : 'Mark as completed'}
          </button>
        </div>
      </section>

      <div className="topic-detail-grid">
        <section className="topic-overview-card">
          <span className="section-eyebrow">OVERVIEW</span>

          <h2>About this topic</h2>

          <p className="overview-description">
            {topic.description}
          </p>

          <div className="coming-soon-box">
            <div className="coming-soon-icon">✦</div>

            <div>
              <strong>Learning content is coming next</strong>

              <p>
                Halaman ini nantinya akan dikembangkan menjadi
                materi belajar lengkap, mulai dari intuisi dan
                penjelasan konsep, contoh langkah demi langkah,
                implementasi C++, hingga latihan soal Competitive
                Programming.
              </p>
            </div>
          </div>
        </section>

        <aside className="learning-path-card">
          <h2>Recommended learning path</h2>

          <p className="learning-path-description">
            Materi berikut sangat disarankan untuk dipahami
            sebelum mempelajari topik ini.
          </p>

          {prerequisites.length > 0 ? (
            <>
              <div className="prerequisite-warning">
                <div className="warning-icon">!</div>

                <div>
                  <strong>Sangat disarankan!</strong>
                  <p>
                    Sebaiknya pelajari materi berikut terlebih
                    dahulu agar kamu lebih mudah memahami{' '}
                    {topic.title}.
                  </p>
                </div>
              </div>

              <div className="prerequisite-list">
                {prerequisites.map((item) => (
                  <button
                    className="prerequisite-item"
                    key={item.id}
                    onClick={() => navigate(`/topics/${item.slug}`)}
                  >
                    <span className="prerequisite-icon">◇</span>

                    <span className="prerequisite-info">
                      <strong>{item.title}</strong>
                      <small>{item.category}</small>
                    </span>

                    <span
                      className={`prerequisite-status ${getStatusClass(item.status)}`}
                    >
                      {getStatusLabel(item.status)}
                    </span>

                    <span className="prerequisite-arrow">→</span>
                  </button>
                ))}
              </div>

              <div className="prerequisite-progress">
                <div className="prerequisite-progress-text">
                  <span>Prerequisite progress</span>
                  <strong>
                    {completedPrerequisites}/{prerequisites.length}
                  </strong>
                </div>

                <div className="prerequisite-progress-track">
                  <div
                    className="prerequisite-progress-fill"
                    style={{
                      width: `${
                        (completedPrerequisites / prerequisites.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <p className="prerequisite-note">
                <span>ⓘ</span>
                Kamu tetap bisa mempelajari topik ini sekarang.
                Prerequisite hanyalah rekomendasi, bukan syarat
                untuk mengakses materi.
              </p>
            </>
          ) : (
            <div className="no-prerequisite">
              <span>✦</span>
              <strong>Ready to get started!</strong>
              <p>
                Tidak ada prerequisite khusus. Kamu bisa langsung
                mempelajari topik ini.
              </p>
            </div>
          )}

          <button
            className="explore-topics-button"
            onClick={() => navigate('/topics')}
          >
            Explore all topics <span>→</span>
          </button>
        </aside>
      </div>
    </div>
  )
}

export default TopicDetail
