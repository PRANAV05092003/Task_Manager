import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Trash2, MessageSquare, Paperclip, Send, User } from "lucide-react";
import { useState } from "react";
import { PRIORITIES, formatDue, getTaskColumn } from "../../utils/taskHelpers.js";
import { useTasks } from "../../context/TasksContext.jsx";
import { useTeam } from "../../context/TeamContext.jsx";
import MemberAvatar from "../team/MemberAvatar.jsx";

export default function TaskDetailModal({ task, meta, open, onClose, onEdit, onDelete }) {
  const { persistMeta, metaMap, updateTask } = useTasks();
  const { members, getMember } = useTeam();
  const [comment, setComment] = useState("");

  if (!task) return null;

  const priority = PRIORITIES[meta?.priority || "medium"];
  const column = getTaskColumn(task, meta);
  const comments = meta?.comments || [];
  const assignee = getMember(meta?.assigneeId);

  const addComment = () => {
    if (!comment.trim()) return;
    const next = {
      ...metaMap,
      [task._id]: {
        ...metaMap[task._id],
        comments: [...comments, { text: comment.trim(), at: new Date().toISOString() }],
      },
    };
    persistMeta(next);
    setComment("");
  };

  const handleAssigneeChange = async (assigneeId) => {
    await updateTask(task._id, {}, { assigneeId: assigneeId || null });
  };

  return (
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
            className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${priority.className}`}>
                    {priority.label}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize">
                    {column.replace("-", " ")}
                  </span>
                </div>
                <h2 className="text-2xl font-bold font-display text-[var(--text-primary)]">{task.title}</h2>
              </div>
              <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--hover)] text-[var(--text-muted)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6 p-4 rounded-xl bg-[var(--hover)] border border-[var(--border)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-3">
                <User className="w-4 h-4" /> Assigned to
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <MemberAvatar member={assignee} size="md" />
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {assignee ? assignee.name : "Unassigned"}
                  </p>
                  {assignee && <p className="text-xs text-[var(--text-muted)]">{assignee.role}</p>}
                </div>
              </div>
              <select
                className="input-field"
                value={meta?.assigneeId || ""}
                onChange={(e) => handleAssigneeChange(e.target.value)}
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {task.description && (
              <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">{task.description}</p>
            )}

            <div className="flex flex-wrap gap-4 mb-6 text-sm text-[var(--text-muted)]">
              {task.dueDate && (
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Due {formatDue(task.dueDate)}
                </span>
              )}
              {(meta?.labels || []).map((label) => (
                <span key={label} className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 text-xs border border-violet-500/20">
                  {label}
                </span>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-3">
                <Paperclip className="w-4 h-4" /> Attachments
              </h3>
              <div className="p-4 rounded-xl border border-dashed border-[var(--border)] text-center text-sm text-[var(--text-muted)]">
                Drop files here (UI preview — connect backend later)
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4" /> Comments
              </h3>
              <div className="space-y-3 mb-3 max-h-40 overflow-y-auto custom-scrollbar">
                {comments.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)]">No comments yet</p>
                ) : (
                  comments.map((c, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[var(--hover)] text-sm text-[var(--text-secondary)]">
                      {c.text}
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <input
                  className="input-field flex-1"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  onKeyDown={(e) => e.key === "Enter" && addComment()}
                />
                <button type="button" onClick={addComment} className="btn-primary !px-3">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
              <button type="button" onClick={() => onEdit(task)} className="btn-secondary flex-1">
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(task._id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
