
import { Link } from 'react-router-dom'
import type { Topic } from '../../data/topics'

type DashboardProps = {
  topics: Topic[]
}

export default function Dashboard({ topics }: DashboardProps) {
  const completedCount = topics.filter(
    (topic) => topic.status === 'completed',
  ).length

  const progress = Math.round((completedCount / topics.length) * 100)

  const nextTopic =
    topics.find((topic) => topic.status === 'available') ?? topics[0]

  return (
    <div className="page-content">
      <section className="welcome-section">
        <div>
          <div className="eyebrow">YOUR PERSONAL CP COMPANION</div>
          <h1>
            Build your skills,
            <br />
            <span>one topic at a time.</span>
          </h1>
          <p>
            A clear path from the basics to advanced competitive programming.
          </p>
        </div>

        <div className="welcome-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="art-node node-a">C++</div>
          <div className="art-node node-b">{'{ }'}</div>
          <div className="art-node node-c">01</div>
          <div className="art-center">c.</div>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-top">
            <span className="stat-icon purple">◇</span>
            <span className="stat-caption">LEARNING PATH</span>
          </div>
          <strong className="stat-number">{topics.length}</strong>
          <span className="stat-description">Topics in this roadmap</span>
        </article>

        <article className="stat-card">
          <div className="stat-top">
            <span className="stat-icon green">✓</span>
            <span className="stat-caption">COMPLETED</span>
          </div>
          <strong className="stat-number">{completedCount}</strong>
          <span className="stat-description">Topics marked as done</span>
        </article>

        <article className="stat-card">
          <div className="stat-top">
            <span className="stat-icon orange">↗</span>
            <span className="stat-caption">NEXT STEP</span>
          </div>
          <strong className="stat-next">{nextTopic.title}</strong>
          <span className="stat-description">Continue your journey</span>
        </article>
      </section>

      <section className="dashboard-next">
        <div>
          <div className="eyebrow">YOUR NEXT MOVE</div>
          <h2>Keep the momentum going.</h2>
          <p>
            You have completed {completedCount} of {topics.length} topics.
            Your overall progress is {progress}%.
          </p>
        </div>

        <Link className="dashboard-button" to="/roadmap">
          Explore roadmap <span>→</span>
        </Link>
      </section>

      <section className="dashboard-topics">
        <div className="section-heading">
          <div>
            <div className="eyebrow">PICK UP WHERE YOU LEFT OFF</div>
            <h2>Continue learning</h2>
          </div>

          <Link className="text-link" to="/roadmap">
            View all topics →
          </Link>
        </div>

        <div className="dashboard-topic-grid">
          {topics
            .filter((topic) => topic.status === 'available')
            .slice(0, 3)
            .map((topic) => (
              <Link
                className="dashboard-topic"
                to="/roadmap"
                key={topic.id}
              >
                <span className="dashboard-topic-icon">{'{ }'}</span>
                <span className="dashboard-topic-category">
                  {topic.category}
                </span>
                <strong>{topic.title}</strong>
                <span className="dashboard-topic-description">
                  {topic.difficulty} · Ready to learn
                </span>
                <span className="dashboard-topic-arrow">Explore →</span>
              </Link>
            ))}
        </div>
      </section>

      <footer className="page-footer">
        <span>cptncc © 2026</span>
        <span>Made for curious problem solvers.</span>
      </footer>
    </div>
  )
}
