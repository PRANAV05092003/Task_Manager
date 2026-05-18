import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { Calendar, GripVertical, MessageSquare, Paperclip } from "lucide-react";
import { PRIORITIES, formatDue, isOverdue, getTaskPriority, getTaskLabels } from "../../utils/taskHelpers.js";
import { useTeam } from "../../context/TeamContext.jsx";
import { resolveAssignee } from "../../utils/teamHelpers.js";
import MemberAvatar from "../team/MemberAvatar.jsx";

export default function KanbanTaskCard({ task, meta, onClick }) {
  const { getMember } = useTeam();
  const assignee = resolveAssignee(task, meta, getMember);
  const priority = PRIORITIES[getTaskPriority(task, meta)];
  const labels = getTaskLabels(task, meta);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
  });

  const overdue = isOverdue(task.dueDate) && task.status !== "completed";

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 50 }
    : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={`glass-card p-4 cursor-pointer group ${isDragging ? "shadow-2xl ring-2 ring-indigo-500/50" : ""}`}
    >
      <div className="flex items-start gap-2 mb-2">
        <button
          type="button"
          className="mt-0.5 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
          {...listeners}
          {...attributes}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-[var(--text-primary)] line-clamp-2">{task.title}</p>
          {task.description && (
            <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${priority.className}`}>
          {priority.label}
        </span>
        {labels.slice(0, 2).map((label) => (
          <span
            key={label}
            className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-[var(--text-muted)]">
        <div className="flex items-center gap-2 text-xs">
          {task.dueDate && (
            <span className={`flex items-center gap-1 ${overdue ? "text-red-400" : ""}`}>
              <Calendar className="w-3 h-3" />
              {formatDue(task.dueDate)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 opacity-50" />
          <Paperclip className="w-3.5 h-3.5 opacity-50" />
          <MemberAvatar member={assignee} size="sm" />
        </div>
      </div>
    </motion.div>
  );
}
