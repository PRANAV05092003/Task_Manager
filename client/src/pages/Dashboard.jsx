import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";
import Sidebar from "../components/layout/Sidebar.jsx";
import Topbar from "../components/layout/Topbar.jsx";
import KanbanBoard from "../components/dashboard/KanbanBoard.jsx";
import AnalyticsPanel from "../components/dashboard/AnalyticsPanel.jsx";
import OverviewWidgets from "../components/dashboard/OverviewWidgets.jsx";
import CalendarWidget from "../components/dashboard/CalendarWidget.jsx";
import TaskFormModal from "../components/dashboard/TaskFormModal.jsx";
import TaskDetailModal from "../components/dashboard/TaskDetailModal.jsx";
import { useTasks } from "../context/TasksContext.jsx";
import { getAnalytics, getTaskColumn } from "../utils/taskHelpers.js";

const sectionTitles = {
  overview: { title: "Dashboard", subtitle: "Your productivity command center" },
  board: { title: "Kanban Board", subtitle: "Drag tasks across columns" },
  analytics: { title: "Analytics", subtitle: "Track team performance" },
  calendar: { title: "Calendar", subtitle: "Upcoming deadlines" },
  team: { title: "Team", subtitle: "Collaboration overview" },
};

export default function Dashboard() {
  const { tasks, metaMap, loading, createTask, updateTask, deleteTask } = useTasks();
  const [section, setSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const stats = getAnalytics(tasks, metaMap);
  const meta = selected ? metaMap[selected._id] : null;

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openDetail = (task) => {
    setSelected(task);
    setDetailOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    setSaving(true);
    const { priority, column, labels, ...taskData } = payload;
    try {
      if (editing) {
        await updateTask(
          editing._id,
          { title: taskData.title, description: taskData.description, dueDate: taskData.dueDate },
          { priority, column, labels }
        );
      } else {
        await createTask(taskData, { priority, column, labels });
      }
      setFormOpen(false);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const handleEditFromDetail = (task) => {
    setDetailOpen(false);
    setEditing({
      ...task,
      priority: metaMap[task._id]?.priority || "medium",
      column: getTaskColumn(task, metaMap[task._id]),
      labels: metaMap[task._id]?.labels || [],
    });
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setDetailOpen(false);
    setSelected(null);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-28" />
          ))}
        </div>
      );
    }

    switch (section) {
      case "board":
        return <KanbanBoard search={search} onTaskClick={openDetail} />;
      case "analytics":
        return <AnalyticsPanel />;
      case "calendar":
        return (
          <div className="grid lg:grid-cols-2 gap-6">
            <CalendarWidget />
            <OverviewWidgets onGoBoard={() => setSection("board")} />
          </div>
        );
      case "team":
        return <OverviewWidgets onGoBoard={() => setSection("board")} />;
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total", value: stats.total, gradient: "from-indigo-500/20 to-violet-500/10" },
                { label: "Completed", value: stats.completed, gradient: "from-emerald-500/20 to-green-500/10" },
                { label: "Pending", value: stats.pending, gradient: "from-amber-500/20 to-orange-500/10" },
                { label: "Overdue", value: stats.overdue, gradient: "from-red-500/20 to-rose-500/10" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-card p-5 bg-gradient-to-br ${s.gradient}`}
                >
                  <p className="text-sm text-[var(--text-muted)]">{s.label}</p>
                  <p className="text-3xl font-bold font-display mt-1 text-[var(--text-primary)]">{s.value}</p>
                </motion.div>
              ))}
            </div>
            <OverviewWidgets onGoBoard={() => setSection("board")} />
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" /> Quick board preview
              </h3>
              <KanbanBoard search={search} onTaskClick={openDetail} />
            </div>
          </div>
        );
    }
  };

  const { title, subtitle } = sectionTitles[section] || sectionTitles.overview;

  return (
    <div className="min-h-screen flex bg-[var(--bg)]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl" />
      </div>

      <Sidebar
        active={section}
        onNavigate={(id) => {
          setSection(id);
          setMobileNav(false);
        }}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      {mobileNav && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileNav(false)}
        />
      )}

      <motion.aside
        className={`fixed md:hidden z-50 h-full ${mobileNav ? "translate-x-0" : "-translate-x-full"} transition-transform`}
      >
        <Sidebar
          active={section}
          onNavigate={(id) => {
            setSection(id);
            setMobileNav(false);
          }}
          collapsed={false}
          onToggle={() => setMobileNav(false)}
        />
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Topbar
          onMenuClick={() => setMobileNav(true)}
          onNewTask={openCreate}
          search={search}
          onSearch={setSearch}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto custom-scrollbar">
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-1">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text-primary)]">{title}</h1>
            </div>
            <p className="text-[var(--text-muted)]">{subtitle}</p>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={section + (loading ? "load" : "ready")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <TaskFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleFormSubmit}
        initial={editing}
        loading={saving}
      />

      <TaskDetailModal
        task={selected}
        meta={meta}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onEdit={handleEditFromDetail}
        onDelete={handleDelete}
      />
    </div>
  );
}
