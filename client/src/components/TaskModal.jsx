const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export default function TaskModal({
  open,
  editing,
  form,
  onChange,
  onSubmit,
  onClose,
  submitting,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden animate-fade-in">
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-violet-50">
          <h3 className="text-lg font-semibold text-slate-900 font-display">
            {editing ? "Edit Task" : "New Task"}
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {editing ? "Update task details" : "Add a task for your team"}
          </p>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              required
              placeholder="e.g. Sprint planning"
              className="input"
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={3}
              placeholder="What needs to be done?"
              className="input resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Status</label>
              <select name="status" value={form.status} onChange={onChange} className="input">
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={onChange}
                className="input"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? "Saving…" : editing ? "Save Changes" : "Create Task"}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


