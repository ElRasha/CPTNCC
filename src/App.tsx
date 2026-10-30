
import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Route,
  Routes,
  useParams,
} from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import Topics from './pages/Topics'
import TopicDetail from './pages/TopicDetail'
import Roadmap from './pages/Roadmap'

import { initialTopics } from './data/topics'
import type { Topic } from './data/topics'
import './App.css'

const STORAGE_KEY = 'cptncc-topics'

function loadTopics(): Topic[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) return initialTopics

    const parsed = JSON.parse(saved) as Topic[]

    if (
      !Array.isArray(parsed) ||
      !parsed.every(
        (topic) =>
          typeof topic.id === 'number' &&
          typeof topic.title === 'string' &&
          Array.isArray(topic.prerequisites) &&
          ['completed', 'learning', 'available', 'locked'].includes(
            topic.status,
          ),
      )
    ) {
      return initialTopics
    }

    return initialTopics.map((topic) => {
      const savedTopic = parsed.find((item) => item.id === topic.id)

      return savedTopic
        ? { ...topic, status: savedTopic.status }
        : topic
    })
  } catch {
    return initialTopics
  }
}

function Workspace() {
  const [topics, setTopics] = useState<Topic[]>(loadTopics)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(topics))
    } catch (error) {
      console.error('Gagal menyimpan progres cptncc:', error)
    }
  }, [topics])

  function toggleCompleted(id: number) {
    setTopics((current) =>
      current.map((topic) =>
        topic.id === id
          ? {
              ...topic,
              status:
                topic.status === 'completed' ? 'available' : 'completed',
            }
          : topic,
      ),
    )
  }

  const completedCount = topics.filter(
    (topic) => topic.status === 'completed',
  ).length

  return (
    <div className="app-shell">
      <Sidebar
        completedCount={completedCount}
        totalTopics={topics.length}
      />

      <main className="main-content">
        <Topbar />

        <Routes>
          <Route path="/" element={<Dashboard topics={topics} />} />

          <Route
            path="/topics"
            element={<Topics topics={topics} />}
          />

          <Route
            path="/topics/:slug"
            element={
              <TopicDetailRoute
                topics={topics}
                onToggleCompleted={toggleCompleted}
              />
            }
          />

          <Route
            path="/topics/:category/:slug"
            element={
              <TopicDetailRoute
                topics={topics}
                onToggleCompleted={toggleCompleted}
              />
            }
          />

          <Route
            path="/roadmap"
            element={
              <Roadmap
                topics={topics}
                onToggleCompleted={toggleCompleted}
              />
            }
          />

          <Route
            path="*"
            element={
              <div style={{ padding: 32 }}>
                <h2>Halaman tidak ditemukan</h2>
                <p>Periksa kembali alamat halaman yang kamu buka.</p>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

function TopicDetailRoute({
  topics,
  onToggleCompleted,
}: {
  topics: Topic[]
  onToggleCompleted: (id: number) => void
}) {
  const { slug } = useParams()

  const topic = topics.find((item) => item.slug === slug)

  if (!topic) {
    return (
      <div style={{ padding: 32 }}>
        <h2>Materi tidak ditemukan</h2>
        <p>Materi ini belum tersedia di katalog.</p>
      </div>
    )
  }

  return (
    <TopicDetail
      topic={topic}
      onToggleCompleted={onToggleCompleted}
    />
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Workspace />
    </BrowserRouter>
  )
}
