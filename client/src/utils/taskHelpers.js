export const COLUMNS = [
  { id: "todo", title: "To Do", status: "pending", color: "from-slate-500/20 to-slate-600/10" },
  { id: "in-progress", title: "In Progress", status: "in-progress", color: "from-blue-500/20 to-cyan-500/10" },
  { id: "review", title: "Review", status: "in-progress", color: "from-violet-500/20 to-purple-500/10" },
  { id: "completed", title: "Completed", status: "completed", color: "from-emerald-500/20 to-green-500/10" },
];

export const PRIORITIES = {
  high: { label: "High", className: "bg-red-500/15 text-red-400 border-red-500/30" },
  medium: { label: "Medium", className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  low: { label: "Low", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
};

export const getTaskColumn = (task, meta = {}) => {
  if (meta.column) return meta.column;
  if (task.status === "completed") return "completed";
  if (task.status === "in-progress") return "in-progress";
  return "todo";
};

export const columnToStatus = (columnId) => {
  const col = COLUMNS.find((c) => c.id === columnId);
  return col?.status || "pending";
};

export const makeId = () => `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
};

export const formatDue = (dueDate) => {
  if (!dueDate) return null;
  return new Date(dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export const getAnalytics = (tasks, metaMap) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const overdue = tasks.filter((t) => isOverdue(t.dueDate) && t.status !== "completed").length;

  const byStatus = [
    { name: "To Do", value: pending, fill: "#94a3b8" },
    { name: "In Progress", value: inProgress, fill: "#3b82f6" },
    { name: "Completed", value: completed, fill: "#10b981" },
  ].filter((d) => d.value > 0);

  const byPriority = [
    { name: "High", value: tasks.filter((t) => metaMap[t._id]?.priority === "high").length, fill: "#ef4444" },
    { name: "Medium", value: tasks.filter((t) => metaMap[t._id]?.priority === "medium").length, fill: "#f59e0b" },
    { name: "Low", value: tasks.filter((t) => metaMap[t._id]?.priority === "low").length, fill: "#22c55e" },
  ].filter((d) => d.value > 0);

  const weekly = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
    day,
    completed: Math.max(0, Math.round((completed / 7) * (0.6 + Math.sin(i) * 0.4) + (total > 0 ? 1 : 0))),
    created: Math.max(0, Math.round((total / 7) * (0.5 + Math.cos(i) * 0.3))),
  }));

  return { total, completed, pending, inProgress, overdue, byStatus, byPriority, weekly, progress: total ? Math.round((completed / total) * 100) : 0 };
};
