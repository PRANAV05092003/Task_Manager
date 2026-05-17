import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTasks } from "../../context/TasksContext.jsx";

export default function CalendarWidget() {
  const { tasks } = useTasks();
  const [month, setMonth] = useState(() => new Date());

  const year = month.getFullYear();
  const m = month.getMonth();
  const firstDay = new Date(year, m, 1).getDay();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const today = new Date();

  const tasksByDay = tasks.reduce((acc, t) => {
    if (!t.dueDate) return acc;
    const d = new Date(t.dueDate).getDate();
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-[var(--text-primary)] font-display">
          {month.toLocaleString("default", { month: "long", year: "numeric" })}
        </h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMonth(new Date(year, m - 1, 1))}
            className="p-2 rounded-lg hover:bg-[var(--hover)] text-[var(--text-muted)]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setMonth(new Date(year, m + 1, 1))}
            className="p-2 rounded-lg hover:bg-[var(--hover)] text-[var(--text-muted)]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-[var(--text-muted)] mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          const isToday =
            day &&
            today.getDate() === day &&
            today.getMonth() === m &&
            today.getFullYear() === year;
          const count = day ? tasksByDay[day] : 0;
          return (
            <div
              key={i}
              className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm ${
                day
                  ? isToday
                    ? "bg-indigo-500 text-white font-semibold"
                    : "hover:bg-[var(--hover)] text-[var(--text-secondary)]"
                  : ""
              }`}
            >
              {day && (
                <>
                  <span>{day}</span>
                  {count > 0 && (
                    <span className={`text-[9px] mt-0.5 ${isToday ? "text-indigo-100" : "text-indigo-400"}`}>
                      {count} task{count > 1 ? "s" : ""}
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
