const sampleJSONText = `{
  "user": {
    "id": 1,
    "name": "John Doe",
    "address": {
      "city": "New York",
      "country": "USA"
    },
    "items": [
      { "name": "item1" },
      { "name": "item2" }
    ]
  }
}`

export default function JsonInput({ value, onChange, onGenerate, onPasteSample, error }) {
  return (
    <div className="bg-slate-50 dark:bg-gray-900 border rounded-xl p-4 transition-colors duration-300 w-full">
      <textarea
        className="w-full min-h-[260px] md:min-h-[320px]
          bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg border 
          border-gray-300 dark:border-gray-700 p-3 font-mono resize-y focus:outline-none focus:ring focus:ring-blue-500"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={sampleJSONText}
      />
      <div className="flex gap-3 mt-4 flex-wrap">
        <button
          className="bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-500 text-white dark:text-gray-900 
            rounded-lg px-4 py-2 font-semibold transition-colors min-w-[130px]"
          onClick={onGenerate}
        >
          Generate Tree
        </button>
        <button
          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white
            rounded-lg px-4 py-2 font-semibold transition-colors min-w-[130px]"
          onClick={onPasteSample}
        >
          Paste Sample
        </button>
      </div>
      {error && (
        <div className="mt-3 px-2 py-1 rounded text-sm bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}
    </div>
  )
}
