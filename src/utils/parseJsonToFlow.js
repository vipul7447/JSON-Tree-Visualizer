// utils/parseJsonToFlow.js

export default function buildNodesEdges(obj, path = 'root', nodes = [], edges = []) {
  const type = 
    obj === null ? 'primitive' :
    Array.isArray(obj) ? 'array' :
    typeof obj === 'object' ? 'object' : 'primitive';

  // Determine label and node color class/style later in React
  let label = path === 'root' ? 'root' : path.split('.').pop() || path 

  if(type === 'primitive') {
    label = `${label}: ${String(obj)}`
  }

  nodes.push({
    id: path,
    data: { label, path, value: obj, type },
    position: { x: 0, y: 0 }, // layout will set real position
  })

  if (type === 'object') {
    for (const key in obj) {
      const childPath = path === 'root' ? key : `${path}.${key}`
      edges.push({
        id: `${path}-${childPath}`, source: path, target: childPath,
      })
      buildNodesEdges(obj[key], childPath, nodes, edges)
    }
  } else if (type === 'array') {
    obj.forEach((item, index) => {
      const childPath = `${path}[${index}]`
      edges.push({
        id: `${path}-${childPath}`, source: path, target: childPath
      })
      buildNodesEdges(item, childPath, nodes, edges)
    })
  }

  return { nodes, edges }
}
