export default function Controls({ api }) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        className="bg-green-600 dark:bg-green-400 hover:bg-green-700 dark:hover:bg-green-500 
          text-white dark:text-gray-900 px-3 py-2 rounded font-medium transition-colors min-w-[100px]"
        onClick={api.exportImage}
        title="Export graph as image"
      >
        Download Image
      </button>
      <button
        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600
          text-gray-800 dark:text-white px-3 py-2 rounded font-medium transition-colors min-w-[100px]"
        onClick={api.clearAll}
        title="Clear All"
      >
        Clear
      </button>
    </div>
  )
}
