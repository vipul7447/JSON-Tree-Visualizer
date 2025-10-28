// ThemeToggle.jsx
export default function ThemeToggle({ theme, setTheme }) {
  return (
    <label className="flex items-center cursor-pointer gap-2 select-none">
      <span className="text-gray-500 dark:text-gray-300">{theme === 'dark' ? 'Dark' : 'Light'}</span>
      <div
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className={`w-12 h-6 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full p-1 transition-colors duration-300`}
      >
        <div
          className={`bg-white dark:bg-gray-800 w-5 h-5 rounded-full shadow transform duration-300 ${
            theme === 'dark' ? 'translate-x-6' : ''
          }`}
        ></div>
      </div>
    </label>
  );
}

