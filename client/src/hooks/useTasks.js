import { useState, useEffect, useCallback } from "react";
import api from "../api/axios.js";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/tasks");
      setTasks(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setTasks([]);
      if (err.status === 401) {
        setError("Session expired. Please sign in again.");
      } else {
        setError(err.message || "Failed to load tasks");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (payload) => {
    await api.post("/tasks", payload);
    await fetchTasks();
  };

  const updateTask = async (id, payload) => {
    await api.put(`/tasks/${id}`, payload);
    await fetchTasks();
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    await fetchTasks();
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    clearError: () => setError(""),
  };
}
