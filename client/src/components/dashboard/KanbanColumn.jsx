import { useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import KanbanTaskCard from "./KanbanTaskCard.jsx";

export default function KanbanColumn({ column, tasks, metaMap, onTaskClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <motion.div
      ref={setNodeRef}
      layout
      className={`flex flex-col min-w-[280px] max-w-[320px] flex-1 rounded-2xl border transition-colors ${
        isOver ? "border-indigo-500/50 bg-indigo-500/5" : "border-[var(--border)] bg-[var(--card)]/50"
      }`}
    >
      <div className={`p-4 rounded-t-2xl bg-gradient-to-r ${column.color} border-b border-[var(--border)]`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-[var(--text-primary)]">{column.title}</h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--hover)] text-[var(--text-secondary)]">
            {tasks.length}
          </span>
        </div>
      </div>
      <div className="flex-1 p-3 space-y-3 min-h-[200px] max-h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar">
        {tasks.map((task) => (
          <KanbanTaskCard
            key={task._id}
            task={task}
            meta={metaMap[task._id]}
            onClick={() => onTaskClick(task)}
          />
        ))}
        {tasks.length === 0 && (
          <p className="text-center text-xs text-[var(--text-muted)] py-8">Drop tasks here</p>
        )}
      </div>
    </motion.div>
  );
}
