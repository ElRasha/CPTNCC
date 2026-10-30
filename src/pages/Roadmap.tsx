
import { useMemo, useState } from 'react'
import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import type { Topic } from '../data/topics'
import './Roadmap.css'

type RoadmapProps = {
  topics: Topic[]
  onToggleCompleted: (id: number) => void
}

type TopicNodeData = {
  topic: Topic
  onSelect: (topic: Topic) => void
}

type StageNodeData = {
  label: string
  subtitle: string
}

type LayoutMode = 'horizontal' | 'vertical'

const stageInfo: Record<number, StageNodeData> = {
  1: { label: '1. FUNDAMENTALS', subtitle: 'Dasar pemrograman' },
  2: { label: '2. BASIC ALGORITHMS', subtitle: 'Teknik dasar algoritma' },
  3: { label: '3. MATH & NUMBER THEORY', subtitle: 'Matematika untuk CP' },
  4: { label: '4. CORE ALGORITHMS', subtitle: 'Graf, greedy, dan DP' },
  5: { label: '5. ADVANCED DATA STRUCTURES', subtitle: 'Struktur data lanjutan' },
}

const stageColors: Record<number, string> = {
  1: 'stage-node--purple',
  2: 'stage-node--blue',
  3: 'stage-node--amber',
  4: 'stage-node--green',
  5: 'stage-node--pink',
}

function TopicNode({ data }: NodeProps<Node<TopicNodeData>>) {
  const { topic, onSelect } = data

  return (
    <div
      className={`topic-node topic-node--${topic.status}`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(topic)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(topic)
        }
      }}
    >
      <Handle type="target" position={Position.Left} />

      <div className="topic-node-title">{topic.title}</div>

      <div className="topic-node-meta">
        <span className="topic-status-dot" />
        <span>{topic.difficulty}</span>
        <span className="topic-node-status">
          {topic.status === 'completed'
            ? 'Selesai'
            : topic.status === 'learning'
              ? 'Dipelajari'
              : topic.status === 'locked'
                ? 'Terkunci'
                : 'Tersedia'}
        </span>
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  )
}

function StageNode({ data }: NodeProps<Node<StageNodeData>>) {
  const stageNumber = Number(data.label.match(/^\d+/)?.[0] ?? 1)

  return (
    <div className={`stage-node ${stageColors[stageNumber] ?? ''}`}>
      <div className="stage-node-title">{data.label}</div>
      <div className="stage-node-subtitle">{data.subtitle}</div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Top} id="top-target" />
      <Handle type="source" position={Position.Bottom} id="bottom-source" />
    </div>
  )
}

const nodeTypes = {
  topic: TopicNode,
  stage: StageNode,
}

export default function Roadmap({
  topics,
  onToggleCompleted,
}: RoadmapProps) {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('horizontal')

  const { nodes, edges } = useMemo(() => {
    const stageWidth = 390
    const topicGap = 124
    const stageHeaderY = 20
    const topicStartY = 130

    const nextNodes: Node[] = []
    const nextEdges: Edge[] = []

    const stages = [...new Set(topics.map((topic) => topic.stage))].sort(
      (a, b) => a - b,
    )

    const groupedTopics = new Map<number, Topic[]>()

    stages.forEach((stage) => {
      groupedTopics.set(
        stage,
        topics.filter((topic) => topic.stage === stage),
      )
    })

    stages.forEach((stage, stageIndex) => {
      const group = groupedTopics.get(stage) ?? []
      const x = stageIndex * stageWidth
      const headerId = `stage-${stage}`
      const info = stageInfo[stage] ?? {
        label: `${stage}. STAGE`,
        subtitle: 'Materi pembelajaran',
      }

      nextNodes.push({
        id: headerId,
        type: 'stage',
        position: { x, y: stageHeaderY },
        data: info,
        className: 'stage-node-wrapper',
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      })

      group.forEach((topic, topicIndex) => {
        const topicId = `topic-${topic.id}`

        nextNodes.push({
          id: topicId,
          type: 'topic',
          position: {
            x: x + 5,
            y: topicStartY + topicIndex * topicGap,
          },
          data: {
            topic,
            onSelect: setSelectedTopic,
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        })

        nextEdges.push({
          id: `${headerId}-${topicId}`,
          source: headerId,
          sourceHandle: 'bottom-source',
          target: topicId,
          targetHandle: 'top-target',
          type: 'smoothstep',
          className: 'stage-edge',
        })
      })

      if (stageIndex > 0) {
        const previousStage = stages[stageIndex - 1]

        nextEdges.push({
          id: `stage-link-${previousStage}-${stage}`,
          source: `stage-${previousStage}`,
          sourceHandle: 'bottom-source',
          target: headerId,
          targetHandle: 'top-target',
          type: 'smoothstep',
          className: 'stage-sequence-edge',
        })
      }
    })

    // Prerequisite edges connect the actual learning dependencies.
    topics.forEach((topic) => {
      topic.prerequisites.forEach((prerequisite) => {
        const prerequisiteTopic = topics.find(
          (candidate) => candidate.title === prerequisite,
        )

        if (!prerequisiteTopic) return

        nextEdges.push({
          id: `prerequisite-${prerequisiteTopic.id}-${topic.id}`,
          source: `topic-${prerequisiteTopic.id}`,
          target: `topic-${topic.id}`,
          type: 'smoothstep',
          className: 'prerequisite-edge',
        })
      })
    })

    // Vertical mode is a geometric rotation of the same dependency graph.
    const finalNodes =
    layoutMode === 'vertical'
      ? nextNodes
      : nextNodes.map((node) => ({
          ...node,
          position: {
          x: node.position.y,
          y: node.position.x,
        },
      }))

   const finalEdges =
  layoutMode === 'vertical'
    ? nextEdges
    : nextEdges.map((edge) => ({
        ...edge,
        sourceHandle:
          edge.sourceHandle === 'bottom-source'
            ? 'right'
            : edge.sourceHandle,
        targetHandle:
          edge.targetHandle === 'top-target'
            ? 'left'
            : edge.targetHandle,
      }))

    return { nodes: finalNodes, edges: finalEdges }
  }, [topics, layoutMode])

  const categorySlug = selectedTopic?.category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  function openTopic() {
    if (!selectedTopic || !categorySlug) return

    window.location.href = `/topics/${categorySlug}/${selectedTopic.slug}`
  }

  return (
    <div className={`roadmap-page roadmap-page--${layoutMode}`}>
      <div className="roadmap-heading">
        <div>
          <h1>Learning Roadmap</h1>
          <p>Ikuti jalur belajar Competitive Programming dari dasar hingga lanjutan.</p>
        </div>

        <div className="roadmap-heading-actions">
          <div className="roadmap-legend">
            <div>
              <span className="legend-line legend-line--stage" />
              <span>Urutan tahap</span>
            </div>
            <div>
              <span className="legend-line legend-line--prerequisite" />
              <span>Prerequisite</span>
            </div>
          </div>

          <div className="layout-switch" aria-label="Mode tampilan roadmap">
            <button
              className={layoutMode === 'horizontal' ? 'active' : ''}
              onClick={() => setLayoutMode('horizontal')}
              title="Tampilan horizontal"
              aria-label="Tampilan horizontal"
            >
              <span>→</span> Horizontal
            </button>
            <button
              className={layoutMode === 'vertical' ? 'active' : ''}
              onClick={() => setLayoutMode('vertical')}
              title="Tampilan vertikal"
              aria-label="Tampilan vertikal"
            >
              <span>↓</span> Vertikal
            </button>
          </div>
        </div>
      </div>

      <div className="roadmap-canvas">
        <ReactFlow
          key={layoutMode}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 0.12,
            minZoom: 0.2,
            maxZoom: 0.9,
          }}
          minZoom={0.12}
          maxZoom={1.5}
          nodesDraggable={false}
          nodesConnectable={false}
          onPaneClick={() => setSelectedTopic(null)}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#e4e4e7" gap={24} />
          <Controls />
        </ReactFlow>
      </div>

      {selectedTopic && (
        <aside className="topic-detail-panel">
          <button
            className="topic-detail-close"
            onClick={() => setSelectedTopic(null)}
            aria-label="Tutup detail materi"
          >
            ×
          </button>

          <span className="topic-detail-category">
            Tahap {selectedTopic.stage} · {selectedTopic.category}
          </span>

          <h2>{selectedTopic.title}</h2>
          <p>{selectedTopic.description}</p>

          <div className="topic-detail-meta">
            <span>
              <strong>Level</strong>
              {selectedTopic.difficulty}
            </span>
            <span>
              <strong>Status</strong>
              {selectedTopic.status}
            </span>
          </div>

          <h3>Prerequisite</h3>

          {selectedTopic.prerequisites.length > 0 ? (
            <ul>
              {selectedTopic.prerequisites.map((prerequisite) => (
                <li key={prerequisite}>{prerequisite}</li>
              ))}
            </ul>
          ) : (
            <p>Materi ini tidak memiliki prerequisite.</p>
          )}

          <button className="topic-learn-button" onClick={openTopic}>
            LEARN <span>→</span>
          </button>

          <button
            className="topic-complete-button"
            onClick={() => onToggleCompleted(selectedTopic.id)}
          >
            {selectedTopic.status === 'completed'
              ? 'Materi sudah selesai'
              : 'Tandai selesai'}
          </button>
        </aside>
      )}
    </div>
  )
}
