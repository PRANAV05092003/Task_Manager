import { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { columnToStatus, getTaskColumn } from "../utils/taskHelpers.js";
import { useAuth } from "./AuthContext.jsx";

const META_KEY = "ithara_task_meta";

const loadCommentsMeta = () => {
  try {
    const raw = localStorage.getItem(META_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveCommentsMeta = (meta) => {
  const commentsOnly = {};
  Object.keys(meta).forEach((id) => {
    if (meta[id]?.comments?.length) {
      commentsOnly[id] = { comments: meta[id].comments };
    }
  });
  localStorage.setItem(META_KEY, JSON.stringify(commentsOnly));
};

const TasksContext = createContext(null);

export const TasksProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [metaMap, setMetaMap] = useState(loadCommentsMeta);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/tasks");
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.message || "Failed to load tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const persistMeta = (next) => {
    setMetaMap(next);
    saveCommentsMeta(next);
  };

  const buildPayload = (payload, meta = {}) => {
    const col = meta.column || "todo";
    return {
      title: payload.title,
      description: payload.description || "",
      dueDate: payload.dueDate || null,
      status: columnToStatus(col),
      kanbanColumn: col,
      column: col,
      priority: meta.priority || "medium",
      labels: meta.labels || [],
      assigneeId: meta.assigneeId || null,
    };
  };

  const createTask = async (payload, meta = {}) => {
    try {
      const { data } = await api.post("/tasks", buildPayload(payload, meta));
      setTasks((prev) => [data, ...prev]);
      toast.success("Task created");
    } catch (err) {
      toast.error(err.message || "Failed to create task");
      throw err;
    }
  };

  const updateTask = async (id, payload, metaUpdates = {}) => {
    try {
      const existing = tasks.find((t) => t._id === id);
      const col = metaUpdates.column ?? getTaskColumn(existing, metaMap[id]);
      const body = {
        ...payload,
        ...(metaUpdates.column && {
          kanbanColumn: metaUpdates.column,
          column: metaUpdates.column,
          status: columnToStatus(metaUpdates.column),
        }),
        ...(metaUpdates.priority !== undefined && { priority: metaUpdates.priority }),
        ...(metaUpdates.labels !== undefined && { labels: metaUpdates.labels }),
        ...(metaUpdates.assigneeId !== undefined && { assigneeId: metaUpdates.assigneeId }),
      };

      if (!metaUpdates.column && payload.status) {
        body.status = payload.status;
      }

      const { data } = await api.put(`/tasks/${id}`, body);
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
      toast.success("Task updated");
    } catch (err) {
      toast.error(err.message || "Failed to update task");
      throw err;
    }
  };

  const moveTask = async (taskId, columnId) => {
    await updateTask(taskId, { status: columnToStatus(columnId) }, { column: columnId });
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      const { [id]: _, ...rest } = metaMap;
      persistMeta(rest);
      toast.success("Task deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete task");
      throw err;
    }
  };

  const getTasksByColumn = (columnId) =>
    tasks.filter((t) => getTaskColumn(t, metaMap[t._id]) === columnId);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        metaMap,
        loading,
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
