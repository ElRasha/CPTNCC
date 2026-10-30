
import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Route,
  Routes,
  useParams,
} from 'react-router-dom'

import Dashboard from './pages/user/Dashboard'
import Topics from './pages/user/Topics'
import TopicDetail from './pages/user/TopicDetail'
import Roadmap from './pages/user/Roadmap'
import Sidebar from './styles/components/Sidebar'
import Topbar from './styles/components/Topbar'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminTopics from './pages/admin/AdminTopics'

import { initialTopics } from './data/topics'
import type { Topic } from './data/topics'
import './App.css'

const STORAGE_KEY = 'cptncc-topics'

// ============================================================
// LOAD TOPICS
// ============================================================

function loadTopics(): Topic[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) {
      return initialTopics
    }

    const parsed: unknown = JSON.parse(saved)

    if (
      !Array.isArray(parsed) ||
      !parsed.every(
        (topic) =>
          topic !== null &&
          typeof topic === 'object' &&
          typeof topic.id === 'number' &&
          typeof topic.title === 'string' &&
          typeof topic.category === 'string' &&
          typeof topic.stage === 'number' &&
          typeof topic.description === 'string' &&
          Array.isArray(topic.prerequisites) &&
          topic.prerequisites.every(
            (item: unknown) => typeof item === 'string',
          ) &&
          typeof topic.difficulty === 'string' &&
          typeof topic.slug === 'string' &&
          ['completed', 'learning', 'available'].includes(
            topic.status,
          ),
      )
    ) {
      return initialTopics
    }

    return parsed as Topic[]
  } catch (error) {
    console.error('Gagal memuat topik:', error)
    return initialTopics
  }
}

// ============================================================
// WORKSPACE
// ============================================================

function Workspace() {
  const [topics, setTopics] = useState<Topic[]>(loadTopics)

  // Simpan semua data topik ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(topics),
      )
    } catch (error) {
      console.error('Gagal menyimpan topik CPTNCC:', error)
    }
  }, [topics])

  // Toggle status completed
  function toggleCompleted(id: number) {
    setTopics((current) =>
      current.map((topic) =>
        topic.id === id
          ? {
              ...topic,
              status:
                topic.status === 'completed'
                  ? 'available'
                  : 'completed',
            }
          : topic,
      ),
    )
  }

  // Tambah topik
  function addTopic(newTopic: Topic) {
    setTopics((current) => [...current, newTopic])
  }

  // Edit topik
  function updateTopic(updatedTopic: Topic) {
    setTopics((current) =>
      current.map((topic) =>
        topic.id === updatedTopic.id ? updatedTopic : topic,
      ),
    )
  }

  // Hapus topik
  function deleteTopic(id: number) {
    setTopics((current) =>
      current.filter((topic) => topic.id !== id),
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
          {/* DASHBOARD */}
          <Route
            path="/"
            element={<Dashboard topics={topics} />}
          />

          {/* TOPICS CATALOG */}
          <Route
            path="/topics"
            element={<Topics topics={topics} />}
          />

          {/* TOPIC DETAIL */}
          <Route
            path="/topics/:slug"
            element={
              <TopicDetailRoute
                topics={topics}
                onToggleCompleted={toggleCompleted}
              />
            }
          />

          {/* TOPIC DETAIL WITH CATEGORY */}
          <Route
            path="/topics/:category/:slug"
            element={
              <TopicDetailRoute
                topics={topics}
                onToggleCompleted={toggleCompleted}
              />
            }
          />

          {/* ROADMAP */}
          <Route
            path="/roadmap"
            element={
              <Roadmap
                topics={topics}
                onToggleCompleted={toggleCompleted}
              />
            }
          />

          {/* ADMIN DASHBOARD */}
          <Route
            path="/admin"
            element={<AdminDashboard topics={topics} />}
          />

          {/* MANAGE TOPICS */}
          <Route
            path="/admin/topics"
            element={
              <AdminTopics
                topics={topics}
                onAdd={addTopic}
                onUpdate={updateTopic}
                onDelete={deleteTopic}
              />
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div style={{ padding: 32 }}>
                <h2>Halaman tidak ditemukan</h2>
                <p>
                  Periksa kembali alamat halaman yang kamu buka.
                </p>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

// ============================================================
// TOPIC DETAIL ROUTE
// ============================================================

function TopicDetailRoute({
  topics,
  onToggleCompleted,
}: {
  topics: Topic[]
  onToggleCompleted: (id: number) => void
}) {
  const { slug } = useParams()

  const topic = topics.find(
    (item) => item.slug === slug,
  )

  if (!topic) {
    return (
      <div style={{ padding: 32 }}>
        <h2>Materi tidak ditemukan</h2>
        <p>
          Materi ini belum tersedia di katalog.
        </p>
      </div>
    )
  }

  return (
    <TopicDetail
      topic={topic}
      topics={topics}
      onToggleComplete={onToggleCompleted}
    />
  )
}

// ============================================================
// APP
// ============================================================

export default function App() {
  return (
    <BrowserRouter>
      <Workspace />
    </BrowserRouter>
  )
}
