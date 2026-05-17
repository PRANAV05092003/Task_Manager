import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Kanban,
  BarChart3,
  Calendar,
  Users,
  Settings,
  Sparkles,
} from "lucide-react";

const nav = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "board", label: "Kanban Board", icon: Kanban },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "team", label: "Team", icon: Users },
];

export default function Sidebar({ active, onNavigate, collapsed, onToggle }) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      className="hidden md:flex flex-col h-screen sticky top-0 border-r border-[var(--border)] bg-[var(--sidebar)] backdrop-blur-xl z-30"
    >
      <div className="p-5 flex items-center gap-3 border-b border-[var(--border)]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-display font-bold text-[var(--text-primary)]">Ithara.ai</p>
            <p className="text-xs text-[var(--text-muted)]">Task Manager</p>
          </div>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-500/15 text-indigo-400 shadow-sm border border-indigo-500/20"
                  : "text-[var(--text-secondary)] hover:bg-[var(--hover)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={onToggle}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:bg-[var(--hover)]"
        >
          <Settings className="w-5 h-5" />
          {!collapsed && "Collapse"}
        </button>
      </div>
    </motion.aside>
  );
}
