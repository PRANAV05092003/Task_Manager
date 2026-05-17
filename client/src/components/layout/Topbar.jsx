import { Search, Bell, Sun, Moon, Plus, Menu } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function Topbar({ onMenuClick, onNewTask, search, onSearch }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--topbar)]/80 backdrop-blur-xl">
      <div className="flex items-center gap-4 px-4 sm:px-6 py-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-[var(--hover)] text-[var(--text-secondary)]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 max-w-xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search tasks, projects..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--input)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-[var(--border)] hover:bg-[var(--hover)] text-[var(--text-secondary)]"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            type="button"
            className="p-2.5 rounded-xl border border-[var(--border)] hover:bg-[var(--hover)] text-[var(--text-secondary)] relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button type="button" onClick={onNewTask} className="btn-primary flex items-center gap-2 !py-2 !px-4">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-sm font-semibold border-2 border-[var(--border)]">
            PM
          </div>
        </div>
      </div>
    </header>
  );
}
