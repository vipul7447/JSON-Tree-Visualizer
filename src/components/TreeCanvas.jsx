import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from 'react'
import ReactFlow, { Background, Controls as RFControls } from 'reactflow'
import { toPng } from 'html-to-image'
import dagre from '@dagrejs/dagre'
import 'reactflow/dist/style.css'

// ----------- JSON → Nodes & Edges ------------
function buildNodesEdges(obj, path = 'root', nodes = [], edges = []) {
  const type =
    obj === null
      ? 'primitive'
      : Array.isArray(obj)
      ? 'array'
      : typeof obj === 'object'
      ? 'object'
      : 'primitive'

  const label = path === 'root' ? 'root' : path.split('.').pop() || path

  nodes.push({
    id: path,
    data: {
      label: type === 'primitive' ? `${label}: ${String(obj)}` : label,
      path,
      value: obj,
      type,
    },
    position: { x: 0, y: 0 },
  })

  if (type === 'object') {
    for (const key in obj) {
      const childPath = path === 'root' ? key : `${path}.${key}`
      edges.push({ id: `${path}-${childPath}`, source: path, target: childPath })
      buildNodesEdges(obj[key], childPath, nodes, edges)
    }
  } else if (type === 'array') {
    obj.forEach((item, i) => {
      const childPath = `${path}[${i}]`
      edges.push({ id: `${path}-${childPath}`, source: path, target: childPath })
      buildNodesEdges(item, childPath, nodes, edges)
    })
  }

  return { nodes, edges }
}

// ----------- Layout ------------
const nodeWidth = 140
const nodeHeight = 48

function layoutTree(nodes, edges) {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: 'TB' })

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  return {
    nodes: nodes.map((node) => {
      const { x, y } = dagreGraph.node(node.id)
      return {
        ...node,
        position: { x: x - nodeWidth / 2, y: y - nodeHeight / 2 },
        sourcePosition: 'bottom',
        targetPosition: 'top',
      }
    }),
    edges,
  }
}

// ----------- Styling ------------
const nodeStyle = (theme, type, highlight) => {
  let background, color
  switch (type) {
    case 'object':
      background = highlight
        ? '#4F46E5'
        : theme === 'dark'
        ? '#4338CA'
        : '#6366F1'
      color = '#fff'
      break
    case 'array':
      background = highlight
        ? '#16A34A'
        : theme === 'dark'
        ? '#15803D'
        : '#34D399'
      color = '#fff'
      break
    case 'primitive':
      background = highlight
        ? '#FBBF24'
        : theme === 'dark'
        ? '#CA8A04'
        : '#FBBF24'
      color = '#333'
      break
    default:
      background = '#888'
      color = '#fff'
  }
  return {
    background,
    color,
    fontWeight: 600,
    borderRadius: 16,
    padding: 12,
    boxShadow: highlight
      ? '0 0 10px 3px rgba(251, 191, 36, 0.75)'
      : '0 2px 8px rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
    userSelect: 'none',
  }
}

// ----------- Main Component ------------
const TreeCanvas = forwardRef(({ initialData, theme }, ref) => {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [highlightId, setHighlightId] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [isOverPanel, setIsOverPanel] = useState(false)
  const [searchStatus, setSearchStatus] = useState('')
  const rfWrapper = useRef()
  const reactFlowInstance = useRef()
  const hoverTimeout = useRef(null)
  const lastMoveTimestamp = useRef(0)

  useEffect(() => {
    if (initialData) {
      const { nodes, edges } = buildNodesEdges(initialData)
      const layouted = layoutTree(nodes, edges)
      setNodes(layouted.nodes)
      setEdges(layouted.edges)
      setHighlightId(null)
      setSearchStatus('')
      setHoveredNode(null)
      setIsOverPanel(false)
    }
  }, [initialData])

  useImperativeHandle(ref, () => ({
    buildFromJson: (obj) => {
      const { nodes, edges } = buildNodesEdges(obj)
      const layouted = layoutTree(nodes, edges)
      setNodes(layouted.nodes)
      setEdges(layouted.edges)
      setHighlightId(null)
      setSearchStatus('')
      setHoveredNode(null)
      setIsOverPanel(false)
    },
    search: (q) => {
      if (!q) {
        setSearchStatus('')
        setHighlightId(null)
        return
      }
      const normalized = q.replace(/^\$\./, '').trim()
      const target = nodes.find((n) => n.data?.path === normalized)
      if (target) {
        setHighlightId(target.id)
        setSearchStatus('Match found')
        if (reactFlowInstance.current && target.position) {
          reactFlowInstance.current.setCenter(target.position.x, target.position.y, {
            duration: 400,
          })
        }
      } else {
        setHighlightId(null)
        setSearchStatus('No match found')
      }
    },
    exportImage: async () => {
      if (!rfWrapper.current) return
      try {
        const dataUrl = await toPng(rfWrapper.current)
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = 'json-tree.png'
        a.click()
      } catch (err) {
        alert('Export failed: ' + err.message)
      }
    },
    clear: () => {
      setNodes([])
      setEdges([])
      setHighlightId(null)
      setSearchStatus('')
      setHoveredNode(null)
      setIsOverPanel(false)
    },
  }))

  const onInit = (rfi) => {
    reactFlowInstance.current = rfi
  }

  const onNodeClick = useCallback((event, node) => {
    if (node.data?.path) {
      navigator.clipboard.writeText(node.data.path)
      alert('Path copied: ' + node.data.path)
    }
    setHighlightId(node.id)
  }, [])

  const onNodeMouseEnter = useCallback((event, node) => {
    setHoveredNode(node)
    lastMoveTimestamp.current = Date.now()
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current)
      hoverTimeout.current = null
    }
  }, [])

  const onNodeMouseMove = useCallback((event, node) => {
    setHoveredNode(node) // keep hover updated on move
    lastMoveTimestamp.current = Date.now()
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current)
      hoverTimeout.current = null
    }
  }, [])

  const onNodeMouseLeave = useCallback(() => {
    hoverTimeout.current = setTimeout(() => {
      const now = Date.now()
      if (now - lastMoveTimestamp.current > 100 && !isOverPanel) {
        setHoveredNode(null)
        hoverTimeout.current = null
      }
    }, 500) // delay before clearing hover
  }, [isOverPanel])

  return (
    <div
      ref={rfWrapper}
      className="relative flex flex-col h-[600px] border rounded-lg bg-white dark:bg-gray-800 overflow-hidden text-sm select-none font-mono"
    >
      <div className="flex-grow">
        <ReactFlow
          nodes={nodes.map((n) => ({
            ...n,
            style: nodeStyle(theme, n.data.type, n.id === highlightId),
          }))}
          edges={edges}
          fitView
          nodesDraggable
          nodesConnectable={false}
          panOnScroll
          panOnDrag
          onInit={onInit}
          onNodeClick={onNodeClick}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseMove={onNodeMouseMove}
          onNodeMouseLeave={onNodeMouseLeave}
        >
          <Background color={theme === 'dark' ? '#444' : '#ddd'} gap={16} />
          <RFControls />
        </ReactFlow>
      </div>

      {/* Info panel below the canvas */}
      <div
        className="border-t p-4 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
        style={{ fontFamily: 'monospace', fontSize: 13, minHeight: 120 }}
        onMouseEnter={() => setIsOverPanel(true)}
        onMouseLeave={() => setIsOverPanel(false)}
      >
        {(hoveredNode || isOverPanel) && hoveredNode ? (
          <>
            <div>
              <strong>Path:</strong> {hoveredNode.data.path}
            </div>
            <div>
              <strong>Value:</strong>{' '}
              {hoveredNode.data.type === 'primitive'
                ? String(hoveredNode.data.value)
                : JSON.stringify(hoveredNode.data.value, null, 2)}
            </div>
            <div>
              <strong>Type:</strong> {hoveredNode.data.type}
            </div>
          </>
        ) : (
          <div>Hover over a node to see its details here</div>
        )}
      </div>

      {/* Search status indicator */}
      {searchStatus && (
        <div
          className={`absolute bottom-2 left-2 px-3 py-1 rounded-md ${
            searchStatus === 'Match found'
              ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-300'
              : 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-300'
          } text-sm select-none pointer-events-none`}
        >
          {searchStatus}
        </div>
      )}
    </div>
  )
})

export default TreeCanvas
