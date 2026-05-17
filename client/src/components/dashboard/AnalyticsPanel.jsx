import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { useTasks } from "../../context/TasksContext.jsx";
import { getAnalytics } from "../../utils/taskHelpers.js";

const Stat = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-5"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-[var(--text-muted)]">{label}</p>
        <p className="text-3xl font-bold font-display mt-1 text-[var(--text-primary)]">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </motion.div>
);

export default function AnalyticsPanel() {
  const { tasks, metaMap } = useTasks();
  const stats = getAnalytics(tasks, metaMap);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={TrendingUp} label="Total Tasks" value={stats.total} color="bg-indigo-500/15 text-indigo-400" delay={0} />
        <Stat icon={CheckCircle2} label="Completed" value={stats.completed} color="bg-emerald-500/15 text-emerald-400" delay={0.05} />
        <Stat icon={Clock} label="In Progress" value={stats.inProgress} color="bg-blue-500/15 text-blue-400" delay={0.1} />
        <Stat icon={AlertTriangle} label="Overdue" value={stats.overdue} color="bg-red-500/15 text-red-400" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">Task distribution</h3>
          <div className="h-64">
            {stats.byStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.byStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                    {stats.byStatus.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[var(--text-muted)] text-sm">No data yet</div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">Weekly performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weekly}>
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Bar dataKey="completed" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="created" fill="#22d3ee" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[var(--text-primary)]">Productivity trend</h3>
          <span className="text-sm text-emerald-400 font-medium">{stats.progress}% complete</span>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.weekly}>
              <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Line type="monotone" dataKey="completed" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: "#8b5cf6" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 h-2 rounded-full bg-[var(--hover)] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.progress}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
