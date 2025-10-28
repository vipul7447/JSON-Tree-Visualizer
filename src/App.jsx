
import React, { useState, useCallback, useRef, useEffect } from 'react'
import JsonInput from './components/JsonInput'
import TreeCanvas from './components/TreeCanvas'
import SearchBar from './components/SearchBar'
import Controls from './components/Controls'
import ThemeToggle from './components/ThemeToggle'
import sampleJson from './sample.json'

export default function App() {
  const [jsonText, setJsonText] = useState(JSON.stringify(sampleJson, null, 2))
  const [dataObj, setDataObj] = useState(sampleJson)
  const [theme, setTheme] = useState('light')
  const [lastError, setLastError] = useState('')
  const canvasRef = useRef()

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const onGenerate = useCallback((text) => {
    try {
      const obj = JSON.parse(text)
      setDataObj(obj)
      setJsonText(text)
      setLastError('')
      canvasRef.current?.buildFromJson(obj)
    } catch (err) {
      setLastError(err.message)
    }
  }, [])

  const api = {
    exportImage: async () => canvasRef.current?.exportImage(),
    clearAll: () => {
      setJsonText('')
      setDataObj(null)
      canvasRef.current?.clear()
    },
    setTheme,
  }

  return (
    <div className={`min-h-screen flex justify-center items-center transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`w-full max-w-[1100px] rounded-2xl shadow-xl transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      } p-4 md:p-8 mx-2`}>
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">JSON Tree Visualizer</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Paste JSON on the left, visualize as a tree on the right.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <Controls api={api} theme={theme} setTheme={setTheme} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5">
            <JsonInput
              value={jsonText}
              onChange={setJsonText}
              onGenerate={() => onGenerate(jsonText)}
              onPasteSample={() => { setJsonText(JSON.stringify(sampleJson, null, 2)); onGenerate(JSON.stringify(sampleJson, null, 2)) }}
              error={lastError}
            />
            {lastError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mt-2 text-sm">
                Error: {lastError}
              </div>
            )}
          </div>
          <div className="md:col-span-7">
            <SearchBar onSearch={q => canvasRef.current?.search(q)} />
            <div className="mt-3">
              <TreeCanvas ref={canvasRef} initialData={dataObj} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
