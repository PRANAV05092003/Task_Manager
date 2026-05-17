import { motion } from "framer-motion";
import { ArrowRight, Users, Activity } from "lucide-react";
import { useTasks } from "../../context/TasksContext.jsx";
import { getAnalytics, formatDue } from "../../utils/taskHelpers.js";

const team = [
  { name: "Alex Chen", role: "Lead", color: "from-pink-400 to-rose-500" },
  { name: "Sam Rivera", role: "Design", color: "from-cyan-400 to-blue-500" },
  { name: "Jordan Lee", role: "Dev", color: "from-violet-400 to-purple-500" },
  { name: "Taylor Kim", role: "QA", color: "from-amber-400 to-orange-500" },
];

export default function OverviewWidgets({ onGoBoard }) {
  const { tasks } = useTasks();
  const stats = getAnalytics(tasks, {});
  const recent = [...tasks].slice(0, 5);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" /> Recent activity
          </h3>
          <button type="button" onClick={onGoBoard} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            View board <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {recent.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No tasks yet. Create your first task!</p>
          ) : (
            recent.map((task, i) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-[var(--hover)]/50 border border-[var(--border)]"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{task.title}</p>
                  <p className="text-xs text-[var(--text-muted)] capitalize">{task.status?.replace("-", " ")}</p>
                </div>
                {task.dueDate && <span className="text-xs text-[var(--text-muted)]">{formatDue(task.dueDate)}</span>}
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-violet-400" /> Team
        </h3>
        <div className="space-y-3">
          {team.map((member) => (
            <div key={member.name} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-xs font-bold`}>
                {member.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{member.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20">
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.progress}%</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Team productivity this week</p>
        </div>
      </motion.div>
    </div>
  );
}
