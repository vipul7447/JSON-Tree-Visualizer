# TreeCanvas: JSON Visualization Component

TreeCanvas is a React component that visualizes any JSON data as an interactive, well-laid-out tree graph. It uses React Flow for rendering and Dagre for automatic node arrangement.

## Features

- Converts JSON objects, arrays, and primitives into a graph of nodes and edges.
- Automatically arranges the graph in a clean top-to-bottom tree layout.
- Shows detailed JSON path, value, and type in an info panel on node hover.
- Click a node to copy its JSON path to the clipboard.
- Supports searching for nodes by JSON path with visual highlighting and centering.
- Allows exporting the current view as a PNG image.
- Supports both light and dark themes.
- High-performance, smooth pan, zoom, and drag interactions.

## Getting Started

### Installation

Install the required dependencies with:

\```
npm install react react-dom reactflow dagre html-to-image
\```

Copy the \TreeCanvas\ component into your project.

### Usage Example

\```
import React from 'react'
import TreeCanvas from './TreeCanvas'

const sampleData = {
  user: {
    name: 'John Doe',
    age: 29,
    hobbies: ['reading', 'programming'],
  },
}

function App() {
  return <TreeCanvas initialData={sampleData} theme="light" />
}

export default App
\```

### Props

| Prop        | Type       | Description                      |
| ----------- | ---------- | -------------------------------|
| initialData | Object     | JSON data to visualize          |
| theme       | "light" \| "dark" | Theme for node and background colors |

## Public Methods

Access these via a React ref on the \TreeCanvas\ component:

- \`buildFromJson(obj)\`: Load and visualize new JSON data.
- \`search(query)\`: Search and highlight node by JSON path.
- \`exportImage()\`: Download the displayed graph as a PNG file.
- \`clear()\`: Clears the current visualization.

## Interaction Details

- *Hover*: Display detailed info of the hovered node in a panel below the graph.
- *Click*: Copies the node’s JSON path to the clipboard.
- *Search*: Highlights and centers matched node by path query.
- *Zoom & Pan*: Use mouse or trackpad for smooth navigation.
- *Drag Nodes*: Nodes can be dragged to rearrange if needed.

## Technology

- React functional components and hooks.
- React Flow for graph rendering and user interaction.
- Dagre for automatic layout calculation.
- html-to-image for exporting graph snapshots.
- CSS and inline styling for theme support.

## Development Notes

- The JSON is parsed recursively into nodes and edges.
- Debounced hover handlers prevent flickering of details panel.
- The details panel stays visible while cursor is over nodes or panel.
- Responsive design with dark mode compatibility.

## License

This project is open source and available under the MIT License.

---

Feel free to fork, contribute, and customize this component for your own JSON visualization needs.
