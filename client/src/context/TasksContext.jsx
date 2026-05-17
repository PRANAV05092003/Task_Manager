import { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { makeId, columnToStatus, getTaskColumn } from "../utils/taskHelpers.js";

const TASKS_KEY = "ithara_tasks";
const META_KEY = "ithara_task_meta";

const loadLocal = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveLocal = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const TasksContext = createContext(null);

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [metaMap, setMetaMap] = useState(() => loadLocal(META_KEY, {}));
  const [loading, setLoading] = useState(true);
  const [useLocal, setUseLocal] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/tasks");
      setTasks(Array.isArray(data) ? data : []);
      setUseLocal(false);
    } catch {
      setTasks(loadLocal(TASKS_KEY, []));
      setUseLocal(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const persistMeta = (next) => {
    setMetaMap(next);
    saveLocal(META_KEY, next);
  };

  const applyLocal = (next) => {
    setTasks(next.tasks);
    saveLocal(TASKS_KEY, next.tasks);
    if (next.meta) persistMeta(next.meta);
  };

  const runMutation = async (apiFn, localFn, successMsg) => {
    if (useLocal) {
      applyLocal(localFn());
      if (successMsg) toast.success(successMsg);
      return;
    }
    try {
      await apiFn();
      await fetchTasks();
      if (successMsg) toast.success(successMsg);
    } catch {
      setUseLocal(true);
      applyLocal(localFn());
      if (successMsg) toast.success(successMsg);
    }
  };

  const createTask = async (payload, meta = {}) => {
    const status = columnToStatus(meta.column || "todo");
    const metaEntry = {
      priority: meta.priority || "medium",
      column: meta.column || "todo",
      labels: meta.labels || [],
      assigneeId: meta.assigneeId || null,
      comments: [],
    };

    const localFn = () => {
      const task = { _id: makeId(), ...payload, status, createdAt: new Date().toISOString() };
      return { tasks: [task, ...tasks], meta: { ...metaMap, [task._id]: metaEntry } };
    };

    if (useLocal) {
      applyLocal(localFn());
      toast.success("Task created");
      return;
    }
    try {
      const { data } = await api.post("/tasks", {
        title: payload.title,
        description: payload.description || "",
        status,
        dueDate: payload.dueDate || null,
      });
      if (data?._id) {
        persistMeta({ ...metaMap, [data._id]: metaEntry });
      }
      await fetchTasks();
      toast.success("Task created");
    } catch {
      setUseLocal(true);
      applyLocal(localFn());
      toast.success("Task created");
    }
  };

  const updateTask = async (id, payload, metaUpdates = {}) => {
    const buildMeta = () => {
      const newMeta = { ...metaMap, [id]: { ...metaMap[id], ...metaUpdates } };
      if (metaUpdates.column) {
        newMeta[id] = { ...newMeta[id], column: metaUpdates.column };
      }
      return newMeta;
    };

    const localFn = () => {
      const nextPayload = { ...payload };
      if (metaUpdates.column) {
        nextPayload.status = columnToStatus(metaUpdates.column);
      }
      return {
        tasks: tasks.map((t) => (t._id === id ? { ...t, ...nextPayload } : t)),
        meta: buildMeta(),
      };
    };

    if (useLocal) {
      applyLocal(localFn());
      toast.success("Task updated");
      return;
    }
    try {
      await api.put(`/tasks/${id}`, payload);
      persistMeta(buildMeta());
      await fetchTasks();
      toast.success("Task updated");
    } catch {
      setUseLocal(true);
      applyLocal(localFn());
      toast.success("Task updated");
    }
  };

  const moveTask = async (taskId, columnId) => {
    const status = columnToStatus(columnId);
    await updateTask(taskId, { status }, { column: columnId });
  };

  const deleteTask = async (id) => {
    await runMutation(
      () => api.delete(`/tasks/${id}`),
      () => {
        const { [id]: _, ...rest } = metaMap;
        return { tasks: tasks.filter((t) => t._id !== id), meta: rest };
      },
      "Task deleted"
    );
  };

  const getTasksByColumn = (columnId) =>
    tasks.filter((t) => getTaskColumn(t, metaMap[t._id]) === columnId);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        metaMap,
        loading,
        useLocal,
        fetchTasks,
        createTask,
        updateTask,
        moveTask,
        deleteTask,
        getTasksByColumn,
        persistMeta,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within TasksProvider");
  return ctx;
};
