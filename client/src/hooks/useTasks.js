import { useState, useEffect, useCallback } from "react";
import api from "../api/axios.js";

const STORAGE_KEY = "ithara_tasks";

const loadLocal = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocal = (tasks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const makeId = () =>
  `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [useLocal, setUseLocal] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/tasks");
      setTasks(Array.isArray(data) ? data : []);
      setUseLocal(false);
      setError("");
    } catch (err) {
      const local = loadLocal();
      setTasks(local);
      setUseLocal(true);
      if (err.status !== 401) {
        setError(
          local.length
            ? ""
            : "API unavailable — your tasks are saved on this device."
        );
      } else {
        setError("");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (import.meta.env.VITE_API_URL) {
      fetchTasks();
    } else {
      setTasks(loadLocal());
      setUseLocal(true);
      setLoading(false);
    }
  }, [fetchTasks]);

  const runWithFallback = async (apiCall, localUpdate) => {
    if (useLocal) {
      const next = localUpdate(tasks);
      setTasks(next);
      saveLocal(next);
      return;
    }
    try {
      await apiCall();
      await fetchTasks();
    } catch {
      setUseLocal(true);
      const current = loadLocal();
      const next = localUpdate(current.length ? current : tasks);
      setTasks(next);
      saveLocal(next);
    }
  };

  const createTask = (payload) =>
    runWithFallback(
      () => api.post("/tasks", payload),
      (list) => [{ _id: makeId(), ...payload, createdAt: new Date().toISOString() }, ...list]
    );

  const updateTask = (id, payload) =>
    runWithFallback(
      () => api.put(`/tasks/${id}`, payload),
      (list) => list.map((t) => (t._id === id ? { ...t, ...payload } : t))
    );

  const deleteTask = (id) =>
    runWithFallback(
      () => api.delete(`/tasks/${id}`),
      (list) => list.filter((t) => t._id !== id)
    );

  return {
    tasks,
    loading,
    error,
    useLocal,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    clearError: () => setError(""),
  };
}
