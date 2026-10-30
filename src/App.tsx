import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useParams,
} from 'react-router-dom'

import Dashboard from './pages/user/Dashboard'
import Topics from './pages/user/Topics'
import TopicDetail from './pages/user/TopicDetail'
import Roadmap from './pages/user/Roadmap'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminTopics from './pages/admin/AdminTopics'
import AdminLayout from './layouts/AdminLayout'

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

    if (!saved) return initialTopics

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
// PUBLIC LAYOUT
// ============================================================

function PublicLayout({
  completedCount,
  totalTopics,
}: {
  completedCount: number
  totalTopics: number
}) {
  return (
    <div className="app-shell">
      <Sidebar
        completedCount={completedCount}
        totalTopics={totalTopics}
      />
      <main className="main-content">
        <Topbar />
        <Outlet />
      </main>
    </div>
  )
}

// ============================================================
// SIMPLE PLACEHOLDER FOR UPCOMING ADMIN MODULES
// ============================================================

function AdminComingSoon({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <section className="admin-coming-soon">
      <span className="admin-coming-soon-label">COMING NEXT</span>
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="admin-coming-soon-card">
        <span>✦</span>
        <div>
          <strong>Module belum tersedia</strong>
          <small>Halaman ini akan kita bangun pada tahap pengembangan berikutnya.</small>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// WORKSPACE
// ============================================================

function Workspace() {
  const [topics, setTopics] = useState<Topic[]>(loadTopics)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(topics))
    } catch (error) {
      console.error('Gagal menyimpan topik CPTNCC:', error)
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

  function addTopic(newTopic: Topic) {
    setTopics((current) => [...current, newTopic])
  }

  function updateTopic(updatedTopic: Topic) {
    setTopics((current) =>
      current.map((topic) =>
        topic.id === updatedTopic.id ? updatedTopic : topic,
      ),
    )
  }

  function deleteTopic(id: number) {
    setTopics((current) => current.filter((topic) => topic.id !== id))
  }

  const completedCount = topics.filter(
    (topic) => topic.status === 'completed',
  ).length

  return (
    <Routes>
      {/* PUBLIC APP */}
      <Route
        element={
          <PublicLayout
            completedCount={completedCount}
            totalTopics={topics.length}
          />
        }
      >
        <Route path="/" element={<Dashboard topics={topics} />} />
        <Route path="/topics" element={<Topics topics={topics} />} />
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
      </Route>

      {/* ADMIN APP: SEPARATE LAYOUT */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard topics={topics} />} />
        <Route
          path="topics"
          element={
            <AdminTopics
              topics={topics}
              onAdd={addTopic}
              onUpdate={updateTopic}
              onDelete={deleteTopic}
            />
          }
        />
        <Route
          path="content"
          element={
            <AdminComingSoon
              title="Content editor"
              description="Buat dan susun materi pembelajaran menggunakan block-based editor."
            />
          }
        />
        <Route
          path="categories"
          element={
            <AdminComingSoon
              title="Categories"
              description="Kelola kategori dan pengelompokan topik CPTNCC."
            />
          }
        />
        <Route
          path="learning-path"
          element={
            <AdminComingSoon
              title="Learning path"
              description="Atur prerequisite dan hubungan antar-topik pembelajaran."
            />
          }
        />
      </Route>

      {/* 404 */}
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
