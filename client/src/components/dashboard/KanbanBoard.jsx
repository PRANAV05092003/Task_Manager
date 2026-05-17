import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from "@dnd-kit/core";
import { useState } from "react";
import { COLUMNS } from "../../utils/taskHelpers.js";
import { useTasks } from "../../context/TasksContext.jsx";
import KanbanColumn from "./KanbanColumn.jsx";
import KanbanTaskCard from "./KanbanTaskCard.jsx";

export default function KanbanBoard({ onTaskClick, search }) {
  const { metaMap, getTasksByColumn, moveTask } = useTasks();
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const filterTasks = (list) => {
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter(
      (t) => t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
    );
  };

  const allTasks = COLUMNS.flatMap((col) => getTasksByColumn(col.id));
  const activeTask = allTasks.find((t) => t._id === activeId);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    if (COLUMNS.some((c) => c.id === over.id)) {
      moveTask(active.id, over.id);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(e) => setActiveId(e.active.id)}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            tasks={filterTasks(getTasksByColumn(col.id))}
            metaMap={metaMap}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="rotate-2 opacity-90">
            <KanbanTaskCard task={activeTask} meta={metaMap[activeTask._id]} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
