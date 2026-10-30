
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { Topic, TopicStatus } from '../../data/topics'
import '../../styles/admin/AdminTopics.css'

type AdminTopicsProps = {
  topics: Topic[]
  onAdd: (topic: Topic) => void
  onUpdate: (topic: Topic) => void
  onDelete: (id: number) => void
}

type TopicForm = {
  title: string
  category: string
  stage: string
  description: string
  prerequisites: string
  difficulty: string
  status: TopicStatus
}

const emptyForm: TopicForm = {
  title: '',
  category: '',
  stage: '1',
  description: '',
  prerequisites: '',
  difficulty: 'Beginner',
  status: 'available',
}

const DELETE_CONFIRMATION_KEY = 'cptncc-skip-delete-confirmation'

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function AdminTopics({
  topics,
  onAdd,
  onUpdate,
  onDelete,
}: AdminTopicsProps) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [form, setForm] = useState<TopicForm>(emptyForm)
  const [error, setError] = useState('')

  // DELETE CONFIRMATION STATE
  const [deleteTarget, setDeleteTarget] = useState<Topic | null>(null)

  const [skipDeleteConfirmation, setSkipDeleteConfirmation] = useState(
    () =>
      localStorage.getItem(DELETE_CONFIRMATION_KEY) === 'true',
  )

  const [dontShowAgain, setDontShowAgain] = useState(false)

  // ============================================================
  // FILTER TOPICS
  // ============================================================

  const categories = useMemo(
    () => [...new Set(topics.map((topic) => topic.category))].sort(),
    [topics],
  )

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      const matchesSearch =
        topic.title.toLowerCase().includes(search.toLowerCase()) ||
        topic.category.toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        categoryFilter === 'All' || topic.category === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [topics, search, categoryFilter])

  // ============================================================
  // ADD / EDIT MODAL
  // ============================================================

  function openAddModal() {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setIsModalOpen(true)
  }

  function openEditModal(topic: Topic) {
    setEditingId(topic.id)

    setForm({
      title: topic.title,
      category: topic.category,
      stage: String(topic.stage),
      description: topic.description,
      prerequisites: topic.prerequisites.join(', '),
      difficulty: topic.difficulty,
      status: topic.status,
    })

    setError('')
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingId(null)
    setForm(emptyForm)
    setError('')
  }

  function updateField<K extends keyof TopicForm>(
    field: K,
    value: TopicForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  // ============================================================
  // SAVE TOPIC
  // ============================================================

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const title = form.title.trim()
    const category = form.category.trim()
    const description = form.description.trim()
    const stage = Number(form.stage)

    if (!title || !category || !description) {
      setError('Judul, kategori, dan deskripsi wajib diisi.')
      return
    }

    if (!Number.isInteger(stage) || stage < 1) {
      setError('Stage harus berupa bilangan bulat minimal 1.')
      return
    }

    const duplicateTitle = topics.some(
      (topic) =>
        topic.title.toLowerCase() === title.toLowerCase() &&
        topic.id !== editingId,
    )

    if (duplicateTitle) {
      setError('Topik dengan judul tersebut sudah ada.')
      return
    }

    const prerequisites = form.prerequisites
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    const slug = createSlug(title)

    if (!slug) {
      setError('Judul topik tidak menghasilkan slug yang valid.')
      return
    }

    const duplicateSlug = topics.some(
      (topic) =>
        topic.slug === slug &&
        topic.id !== editingId,
    )

    if (duplicateSlug) {
      setError('Slug topik sudah digunakan. Coba judul yang berbeda.')
      return
    }

    const topic: Topic = {
      id:
        editingId ??
        Math.max(0, ...topics.map((item) => item.id)) + 1,
      title,
      category,
      stage,
      description,
      prerequisites,
      difficulty: form.difficulty,
      status: form.status,
      slug,
    }

    if (editingId === null) {
      onAdd(topic)
    } else {
      onUpdate(topic)
    }

    closeModal()
  }

  // ============================================================
  // DELETE TOPIC
  // ============================================================

  function handleDelete(topic: Topic) {
    // Kalau user sudah memilih jangan tampilkan lagi,
    // langsung hapus tanpa membuka modal.
    if (skipDeleteConfirmation) {
      onDelete(topic.id)
      return
    }

    setDeleteTarget(topic)
    setDontShowAgain(false)
  }

  function confirmDelete() {
    if (!deleteTarget) return

    // Simpan preferensi jika checkbox dicentang.
    if (dontShowAgain) {
      localStorage.setItem(
        DELETE_CONFIRMATION_KEY,
        'true',
      )

      setSkipDeleteConfirmation(true)
    }

    onDelete(deleteTarget.id)

    setDeleteTarget(null)
    setDontShowAgain(false)
  }

  function cancelDelete() {
    setDeleteTarget(null)
    setDontShowAgain(false)
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="manage-topics-page">

      {/* HEADER */}
      <div className="manage-topics-header">
        <div>
          <div className="admin-breadcrumb">
            CPTNCC <span>/</span> Admin <span>/</span> Topics
          </div>

          <h1>Manage Topics</h1>

          <p>
            Tambah, edit, dan kelola seluruh topik pembelajaran CPTNCC.
          </p>
        </div>

        <button
          className="manage-add-button"
          onClick={openAddModal}
        >
          <span>＋</span>
          Add new topic
        </button>
      </div>

      {/* SUMMARY */}
      <div className="manage-topic-summary">
        <div>
          <span>Total topics</span>
          <strong>{topics.length}</strong>
        </div>

        <div>
          <span>Categories</span>
          <strong>{categories.length}</strong>
        </div>

        <div>
          <span>Filtered results</span>
          <strong>{filteredTopics.length}</strong>
        </div>
      </div>

      {/* TOPIC TABLE */}
      <section className="manage-topics-panel">
        <div className="manage-toolbar">
          <div>
            <h2>All topics</h2>
            <p>Daftar seluruh topik yang tersedia.</p>
          </div>

          <div className="manage-filters">
            <div className="manage-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search topics..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
            >
              <option value="All">All categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="manage-table-wrapper">
          <table className="manage-table">
            <thead>
              <tr>
                <th>TOPIC</th>
                <th>CATEGORY</th>
                <th>STAGE</th>
                <th>DIFFICULTY</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredTopics.map((topic) => (
                <tr key={topic.id}>
                  <td>
                    <div className="manage-topic-title">
                      <span>
                        {String(topic.id).padStart(2, '0')}
                      </span>

                      <div>
                        <strong>{topic.title}</strong>
                        <small>{topic.slug}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="manage-category-label">
                      {topic.category}
                    </span>
                  </td>

                  <td>Stage {topic.stage}</td>

                  <td>
                    <span
                      className={`manage-difficulty ${topic.difficulty.toLowerCase()}`}
                    >
                      {topic.difficulty}
                    </span>
                  </td>

                  <td>
                    <span className={`manage-status ${topic.status}`}>
                      {topic.status === 'completed'
                        ? 'Completed'
                        : topic.status === 'learning'
                          ? 'Learning'
                          : 'Available'}
                    </span>
                  </td>

                  <td>
                    <div className="manage-actions">
                      <button
                        className="manage-edit-button"
                        onClick={() => openEditModal(topic)}
                      >
                        Edit
                      </button>

                      <button
                        className="manage-delete-button"
                        onClick={() => handleDelete(topic)}
                        aria-label={`Delete ${topic.title}`}
                      >
                        ×
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredTopics.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="manage-empty">
                      <span>⌕</span>
                      <strong>Topik tidak ditemukan</strong>
                      <p>
                        Coba kata kunci atau kategori lainnya.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ======================================================
          ADD / EDIT MODAL
      ====================================================== */}

      {isModalOpen && (
        <div
          className="manage-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal()
            }
          }}
        >
          <div
            className="manage-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="manage-modal-title"
          >
            <div className="manage-modal-header">
              <div>
                <span>TOPIC MANAGEMENT</span>

                <h2 id="manage-modal-title">
                  {editingId === null
                    ? 'Add new topic'
                    : 'Edit topic'}
                </h2>

                <p>
                  Lengkapi informasi topik pembelajaran di bawah ini.
                </p>
              </div>

              <button
                className="manage-modal-close"
                onClick={closeModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="manage-form-grid">

                <label className="manage-form-field full">
                  <span>Topic title *</span>

                  <input
                    value={form.title}
                    onChange={(event) =>
                      updateField('title', event.target.value)
                    }
                    placeholder="e.g. Dynamic Programming"
                    autoFocus
                  />
                </label>

                <label className="manage-form-field">
                  <span>Category *</span>

                  <input
                    value={form.category}
                    onChange={(event) =>
                      updateField('category', event.target.value)
                    }
                    placeholder="e.g. Basic Algorithms"
                    list="topic-categories"
                  />

                  <datalist id="topic-categories">
                    {categories.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                </label>

                <label className="manage-form-field">
                  <span>Stage *</span>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.stage}
                    onChange={(event) =>
                      updateField('stage', event.target.value)
                    }
                  />
                </label>

                <label className="manage-form-field">
                  <span>Difficulty</span>

                  <select
                    value={form.difficulty}
                    onChange={(event) =>
                      updateField('difficulty', event.target.value)
                    }
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </label>

                <label className="manage-form-field">
                  <span>Status</span>

                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateField(
                        'status',
                        event.target.value as TopicStatus,
                      )
                    }
                  >
                    <option value="available">Available</option>
                    <option value="learning">Learning</option>
                    <option value="completed">Completed</option>
                  </select>
                </label>

                <label className="manage-form-field full">
                  <span>Description *</span>

                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(event) =>
                      updateField('description', event.target.value)
                    }
                    placeholder="Jelaskan apa yang akan dipelajari..."
                  />
                </label>

                <label className="manage-form-field full">
                  <span>Prerequisites</span>

                  <input
                    value={form.prerequisites}
                    onChange={(event) =>
                      updateField(
                        'prerequisites',
                        event.target.value,
                      )
                    }
                    placeholder="C++ Fundamentals, Complexity Analysis"
                  />

                  <small>
                    Pisahkan nama topik dengan koma. Prerequisite
                    hanya rekomendasi, bukan pengunci akses.
                  </small>
                </label>

              </div>

              {error && (
                <div className="manage-form-error">
                  {error}
                </div>
              )}

              <div className="manage-modal-footer">
                <button
                  type="button"
                  className="manage-cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="manage-save-button"
                >
                  {editingId === null
                    ? 'Create topic'
                    : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================
          DELETE CONFIRMATION MODAL
      ====================================================== */}

      {deleteTarget && (
        <div
          className="delete-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              cancelDelete()
            }
          }}
        >
          <div
            className="delete-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
          >
            <div className="delete-modal-icon">
              <span>!</span>
            </div>

            <h2 id="delete-modal-title">
              Delete this topic?
            </h2>

            <p id="delete-modal-description">
              Kamu yakin ingin menghapus{' '}
              <strong>{deleteTarget.title}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </p>

            <label className="delete-modal-checkbox">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(event) =>
                  setDontShowAgain(event.target.checked)
                }
              />

              <span>
                Jangan tampilkan konfirmasi ini lagi
              </span>
            </label>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-cancel-button"
                onClick={cancelDelete}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-confirm-button"
                onClick={confirmDelete}
              >
                Delete topic
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
