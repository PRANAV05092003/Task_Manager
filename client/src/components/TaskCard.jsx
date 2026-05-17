const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 ring-amber-600/20",
    dot: "bg-amber-500",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-blue-50 text-blue-700 ring-blue-600/20",
    dot: "bg-blue-500",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    dot: "bg-emerald-500",
  },
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const status = statusConfig[task.status] || statusConfig.pending;

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-lg hover:border-indigo-200/60 transition-all duration-200">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4 justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-base font-semibold text-slate-900 truncate">{task.title}</h3>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${status.className}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>
          {task.description && (
            <p className="text-sm text-slate-600 mt-2 line-clamp-2">{task.description}</p>
          )}
          {task.dueDate && (
            <p className="inline-flex items-center gap-1.5 text-xs text-slate-500 mt-3">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Due {new Date(task.dueDate).toLocaleDateString(undefined, { dateStyle: "medium" })}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:opacity-90 group-hover:opacity-100">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task, e.target.value)}
            className="text-sm px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button type="button" onClick={() => onEdit(task)} className="btn-ghost text-indigo-600">
            Edit
          </button>
          <button type="button" onClick={() => onDelete(task._id)} className="btn-ghost text-red-600">
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

