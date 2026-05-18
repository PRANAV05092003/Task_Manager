import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { COLUMNS, PRIORITIES } from "../../utils/taskHelpers.js";
import { useTeam } from "../../context/TeamContext.jsx";
import { getRoleLabel } from "../../utils/teamHelpers.js";
import MemberAvatar from "../team/MemberAvatar.jsx";
import TeamMemberModal from "../team/TeamMemberModal.jsx";

const empty = {
  title: "",
  description: "",
  dueDate: "",
  priority: "medium",
  column: "todo",
  labels: "",
  assigneeId: "",
};

export default function TaskFormModal({ open, onClose, onSubmit, initial, loading }) {
  const { members, addMember } = useTeam();
  const [form, setForm] = useState(empty);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [addingMember, setAddingMember] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              title: initial.title || "",
              description: initial.description || "",
              dueDate: initial.dueDate ? initial.dueDate.slice(0, 10) : "",
              priority: initial.priority || "medium",
              column: initial.column || "todo",
              labels: (initial.labels || []).join(", "),
              assigneeId: initial.assigneeId || "",
            }
          : empty
      );
    }
  }, [open, initial]);

  const handleAddMember = async (memberForm) => {
    setAddingMember(true);
    try {
      const member = await addMember(memberForm);
      if (member) {
        setForm((f) => ({ ...f, assigneeId: member.id }));
        setMemberModalOpen(false);
      }
    } finally {
      setAddingMember(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate || null,
      priority: form.priority,
      column: form.column,
      assigneeId: form.assigneeId || null,
      labels: form.labels
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean),
    });
  };

  const selectedMember = members.find((m) => m.id === form.assigneeId);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-display text-[var(--text-primary)]">
                  {initial ? "Edit task" : "Create task"}
                </h2>
                <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--hover)] text-[var(--text-muted)]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-1.5 block">Title</label>
                  <input
                    className="input-field"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Task title"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-1.5 block">Description</label>
                  <textarea
                    className="input-field min-h-[80px] resize-none"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Add details..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-[var(--text-secondary)]">Assign to</label>
                    <button
                      type="button"
                      onClick={() => setMemberModalOpen(true)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> New member
                    </button>
                  </div>
                  {members.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => setMemberModalOpen(true)}
                      className="w-full py-3 rounded-xl border border-dashed border-[var(--border)] text-sm text-[var(--text-muted)] hover:bg-[var(--hover)] flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add a team member first
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <select
                        className="input-field"
                        value={form.assigneeId}
                        onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
                      >
                        <option value="">Unassigned</option>
                        {members.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} — {getRoleLabel(m.role)}
                          </option>
                        ))}
                      </select>
                      {selectedMember && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--hover)] border border-[var(--border)]">
                          <MemberAvatar member={selectedMember} size="md" />
                          <div>
                            <p className="text-sm font-medium text-[var(--text-primary)]">{selectedMember.name}</p>
                            <p className="text-xs text-[var(--text-muted)]">{getRoleLabel(selectedMember.role)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-1.5 block">Priority</label>
                    <select
                      className="input-field"
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    >
                      {Object.keys(PRIORITIES).map((p) => (
                        <option key={p} value={p}>
                          {PRIORITIES[p].label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-1.5 block">Column</label>
                    <select
                      className="input-field"
                      value={form.column}
                      onChange={(e) => setForm({ ...form, column: e.target.value })}
                    >
                      {COLUMNS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-1.5 block">Due date</label>
                    <input
                      type="date"
                      className="input-field"
                      value={form.dueDate}
                      onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-1.5 block">Labels</label>
                    <input
                      className="input-field"
                      value={form.labels}
                      onChange={(e) => setForm({ ...form, labels: e.target.value })}
                      placeholder="design, urgent"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose} className="btn-secondary flex-1">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="btn-primary flex-1">
                    {loading ? "Saving..." : initial ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <TeamMemberModal
        open={memberModalOpen}
        onClose={() => setMemberModalOpen(false)}
        onSave={handleAddMember}
        initial={null}
        loading={addingMember}
      />
    </>
  );
}
