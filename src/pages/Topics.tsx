
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Topic } from '../data/topics'
import './Topics.css'

type TopicsProps = {
  topics: Topic[]
}

const difficultyOrder = ['Beginner', 'Intermediate', 'Advanced']

const categoryIcons: Record<string, string> = {
  Fundamentals: '⌘',
  'Basic Algorithms': '⌁',
  'Math & Number Theory': 'π',
  'Data Structures & Graphs': '◇',
  'Greedy & Dynamic Programming': '∿',
  'Advanced Data Structures': '▦',
}

const categoryColors: Record<string, string> = {
  Fundamentals: 'purple',
  'Basic Algorithms': 'blue',
  'Math & Number Theory': 'amber',
  'Data Structures & Graphs': 'green',
  'Greedy & Dynamic Programming': 'pink',
  'Advanced Data Structures': 'indigo',
}

function statusLabel(status: Topic['status']) {
  switch (status) {
    case 'completed':
      return 'Completed'
    case 'learning':
      return 'Learning'
    case 'locked':
      return 'Locked'
    default:
      return 'Available'
  }
}

export default function Topics({ topics }: TopicsProps) {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Topics')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [sortBy, setSortBy] = useState('default')

  const categories = useMemo(
    () => [...new Set(topics.map((topic) => topic.category))].sort(),
    [topics],
  )

  const filteredTopics = useMemo(() => {
    const query = search.trim().toLowerCase()

    const result = topics.filter((topic) => {
      const matchesSearch =
        !query ||
        topic.title.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query) ||
        topic.category.toLowerCase().includes(query) ||
        topic.prerequisites.some((item) =>
          item.toLowerCase().includes(query),
        )

      const matchesCategory =
        selectedCategory === 'All Topics' ||
        topic.category === selectedCategory

      const matchesDifficulty =
        selectedDifficulty === 'All Levels' ||
        topic.difficulty === selectedDifficulty

      const matchesStatus =
        selectedStatus === 'All Status' ||
        topic.status === selectedStatus

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDifficulty &&
        matchesStatus
      )
    })

    if (sortBy === 'alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'difficulty') {
      result.sort(
        (a, b) =>
          difficultyOrder.indexOf(a.difficulty) -
          difficultyOrder.indexOf(b.difficulty),
      )
    } else {
      result.sort((a, b) => a.id - b.id)
    }

    return result
  }, [
    topics,
    search,
    selectedCategory,
    selectedDifficulty,
    selectedStatus,
    sortBy,
  ])

  const completedCount = topics.filter(
    (topic) => topic.status === 'completed',
  ).length

  function openTopic(slug: string) {
    navigate(`/topics/${slug}`)
  }

  function resetFilters() {
    setSearch('')
    setSelectedCategory('All Topics')
    setSelectedDifficulty('All Levels')
    setSelectedStatus('All Status')
    setSortBy('default')
  }

  return (
    <div className="topics-page">
      <section className="topics-hero">
        <div className="topics-hero-content">
          <span className="topics-eyebrow">
            YOUR LEARNING LIBRARY
          </span>

          <h1>Explore Topics<span>.</span></h1>

          <p>
            Temukan konsep, pelajari algoritma, dan bangun kemampuan
            Competitive Programming selangkah demi selangkah.
          </p>
        </div>

        <div className="topics-hero-decoration" aria-hidden="true">
          <div className="decoration-orbit orbit-one" />
          <div className="decoration-orbit orbit-two" />
          <div className="decoration-center">c</div>
          <span className="decoration-symbol symbol-one">{'{}'}</span>
          <span className="decoration-symbol symbol-two">O(log n)</span>
          <span className="decoration-symbol symbol-three">Σ</span>
        </div>
      </section>

      <section className="topics-overview">
        <div className="topics-overview-item">
          <span className="overview-icon overview-icon--purple">▤</span>
          <div>
            <strong>{topics.length}</strong>
            <span>Total topics</span>
          </div>
        </div>

        <div className="overview-divider" />

        <div className="topics-overview-item">
          <span className="overview-icon overview-icon--green">✓</span>
          <div>
            <strong>{completedCount}</strong>
            <span>Completed</span>
          </div>
        </div>

        <div className="overview-divider" />

        <div className="topics-overview-item">
          <span className="overview-icon overview-icon--blue">↗</span>
          <div>
            <strong>
              {topics.filter((topic) => topic.status === 'learning').length}
            </strong>
            <span>In progress</span>
          </div>
        </div>
      </section>

      <section className="topics-library">
        <div className="topics-library-heading">
          <div>
            <h2>Browse library</h2>
            <p>Pilih materi yang ingin kamu pelajari.</p>
          </div>

          <label className="topics-sort">
            <span>Sort by</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="default">Default order</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="difficulty">Difficulty</option>
            </select>
          </label>
        </div>

        <label className="topics-search">
          <span className="topics-search-icon">⌕</span>
          <input
            type="search"
            placeholder="Cari materi, algoritma, atau konsep..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && (
            <button
              type="button"
              className="topics-clear-search"
              onClick={() => setSearch('')}
              aria-label="Hapus pencarian"
            >
              ×
            </button>
          )}
        </label>

        <div className="topics-filter-section">
          <div className="topics-filter-group">
            <span className="topics-filter-label">CATEGORY</span>
            <div className="topics-filter-chips">
              <button
                className={`topics-chip ${
                  selectedCategory === 'All Topics' ? 'active' : ''
                }`}
                onClick={() => setSelectedCategory('All Topics')}
              >
                All Topics
              </button>

              {categories.map((category) => (
                <button
                  key={category}
                  className={`topics-chip ${
                    selectedCategory === category ? 'active' : ''
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="topics-secondary-filters">
            <label>
              <span>Level</span>
              <select
                value={selectedDifficulty}
                onChange={(event) =>
                  setSelectedDifficulty(event.target.value)
                }
              >
                <option value="All Levels">All levels</option>
                {difficultyOrder.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Status</span>
              <select
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value)}
              >
                <option value="All Status">All status</option>
                <option value="available">Available</option>
                <option value="learning">Learning</option>
                <option value="completed">Completed</option>
                <option value="locked">Locked</option>
              </select>
            </label>
          </div>
        </div>

        <div className="topics-results-heading">
          <span>
            Showing <strong>{filteredTopics.length}</strong> of{' '}
            <strong>{topics.length}</strong> topics
          </span>

          {(search ||
            selectedCategory !== 'All Topics' ||
            selectedDifficulty !== 'All Levels' ||
            selectedStatus !== 'All Status') && (
            <button onClick={resetFilters}>Reset filters ×</button>
          )}
        </div>

        {filteredTopics.length > 0 ? (
          <div className="topics-grid">
            {filteredTopics.map((topic) => {
              const color = categoryColors[topic.category] ?? 'purple'

              return (
                <button
                  type="button"
                  className="topic-card"
                  key={topic.id}
                  onClick={() => openTopic(topic.slug)}
                >
                  <div className="topic-card-top">
                    <span
                      className={`topic-card-icon topic-card-icon--${color}`}
                    >
                      {categoryIcons[topic.category] ?? '◇'}
                    </span>

                    <span
                      className={`topic-status-badge topic-status-badge--${topic.status}`}
                    >
                      <span />
                      {statusLabel(topic.status)}
                    </span>
                  </div>

                  <div className="topic-card-category">
                    {topic.category}
                  </div>

                  <h3>{topic.title}</h3>

                  <p className="topic-card-description">
                    {topic.description}
                  </p>

                  <div className="topic-card-prerequisites">
                    <span>PREREQUISITES</span>
                    <p>
                      {topic.prerequisites.length > 0
                        ? topic.prerequisites.join(', ')
                        : 'No prerequisites'}
                    </p>
                  </div>

                  <div className="topic-card-footer">
                    <span
                      className={`topic-difficulty topic-difficulty--${topic.difficulty.toLowerCase()}`}
                    >
                      {topic.difficulty}
                    </span>

                    <span className="topic-card-link">
                      Explore <span>↗</span>
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="topics-empty">
            <div className="topics-empty-icon">⌕</div>
            <h3>No topics found</h3>
            <p>
              Coba kata kunci atau filter lain untuk menemukan materi.
            </p>
            <button onClick={resetFilters}>Reset all filters</button>
          </div>
        )}
      </section>
    </div>
  )
}
