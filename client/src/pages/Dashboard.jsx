import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTasks } from "../hooks/useTasks.js";
import StatCard from "../components/StatCard.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskModal from "../components/TaskModal.jsx";

const emptyForm = {
  title: "",
  description: "",
  status: "pending",
  dueDate: "",
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    clearError,
  } = useTasks();

  useEffect(() => {
    if (error?.includes("Session expired")) {
      logout();
      navigate("/login", { replace: true });
    }
  }, [error, logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
    clearError();
  };

  const openEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
    });
    setEditingId(task._id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      dueDate: form.dueDate || null,
    };
    try {
      if (editingId) {
        await updateTask(editingId, payload);
      } else {
        await createTask(payload);
      }
      closeModal();
    } catch (err) {
      // useTasks handles fallback
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    await deleteTask(id);
  };

  const handleStatusChange = async (task, newStatus) => {
    await updateTask(task._id, { status: newStatus });
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white font-display tracking-tight">
                Ithara.ai
              </h1>
              <p className="text-xs text-slate-400">
                Hi, {user?.name?.split(" ")[0] || "there"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={openCreate} className="btn-primary flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              New Task
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 border border-slate-700 hover:bg-slate-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <section className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
            Good to see you, {user?.name?.split(" ")[0] || "there"} 👋
          </h2>
          <p className="text-slate-400 mt-1 max-w-xl">
            Organize your team&apos;s work, track progress, and ship faster — all in one place.
          </p>
        </section>

        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
            <button type="button" onClick={clearError} className="ml-auto text-red-400 hover:text-red-300">
              ×
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Tasks" value={stats.total} type="total" />
          <StatCard label="Pending" value={stats.pending} type="pending" />
          <StatCard label="In Progress" value={stats.inProgress} type="in-progress" />
          <StatCard label="Completed" value={stats.completed} type="completed" />
        </div>

        {/* Tasks */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-white font-display">Your Tasks</h3>
            <span className="text-sm text-slate-500">{tasks.length} total</span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-24" />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-16 px-6 rounded-2xl border border-dashed border-slate-700/80 bg-slate-900/50">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h4 className="text-white font-medium mb-1">No tasks yet</h4>
              <p className="text-slate-500 text-sm mb-6">Create your first task to get started</p>
              <button type="button" onClick={openCreate} className="btn-primary">
                Create your first task
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id || task.title}
                  task={task}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <TaskModal
        open={modalOpen}
        editing={!!editingId}
        form={form}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        onClose={closeModal}
        submitting={submitting}
      />
    </div>
  );
}

