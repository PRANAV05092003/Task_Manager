import { motion } from "framer-motion";
import { ArrowRight, Users, Activity, Pencil } from "lucide-react";
import { useTasks } from "../../context/TasksContext.jsx";
import { useTeam } from "../../context/TeamContext.jsx";
import { getAnalytics, formatDue } from "../../utils/taskHelpers.js";
import { getMemberTaskCount } from "../../utils/teamHelpers.js";
import MemberAvatar from "../team/MemberAvatar.jsx";

export default function OverviewWidgets({ onGoBoard, onManageTeam }) {
  const { tasks, metaMap } = useTasks();
  const { members, getMember } = useTeam();
  const stats = getAnalytics(tasks, metaMap);
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
            recent.map((task, i) => {
              const assignee = getMember(metaMap[task._id]?.assigneeId);
              return (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[var(--hover)]/50 border border-[var(--border)]"
                >
                  <MemberAvatar member={assignee} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{task.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {assignee ? assignee.name : "Unassigned"} · {task.status?.replace("-", " ")}
                    </p>
                  </div>
                  {task.dueDate && <span className="text-xs text-[var(--text-muted)]">{formatDue(task.dueDate)}</span>}
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Users className="w-4 h-4 text-violet-400" /> Team
          </h3>
          {onManageTeam && (
            <button type="button" onClick={onManageTeam} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              Manage <Pencil className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
          {members.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No team members. Add members in Team tab.</p>
          ) : (
            members.map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <MemberAvatar member={member} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{member.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {member.role} · {getMemberTaskCount(member.id, tasks, metaMap)} tasks
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20">
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.progress}%</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Team productivity this week</p>
        </div>
      </motion.div>
    </div>
  );
}
