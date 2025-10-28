import { useState } from 'react'
export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')
  return (
    <div className="flex items-center gap-3 bg-slate-50 dark:bg-gray-900 rounded-xl px-4 py-3 border transition-colors w-full mb-2">
      <input
        className="flex-1 bg-transparent outline-none text-gray-800 dark:text-white font-mono"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="$.user.address.city"
      />
      <button
        className="bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-500
          text-white dark:text-gray-900 px-4 py-2 rounded-lg font-semibold transition-colors min-w-[100px]"
        onClick={() => onSearch(query)}
      >
        Search
      </button>
    </div>
  )
}
