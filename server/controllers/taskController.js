import Task from "../models/Task.js";

const parseDueDate = (value) => {
  if (!value || value === "") return null;
  return value;
};

const statusFromColumn = (column) => {
  const map = {
    todo: "pending",
    "in-progress": "in-progress",
    review: "in-progress",
    completed: "completed",
  };
  return map[column] || "pending";
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id })
      .populate("assignee")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error("[Tasks] getTasks error:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate, assigneeId, priority, labels, kanbanColumn, column } =
      req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const col = kanbanColumn || column || "todo";

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || "",
      status: status || statusFromColumn(col),
      kanbanColumn: col,
      priority: priority || "medium",
      labels: Array.isArray(labels) ? labels : [],
      dueDate: parseDueDate(dueDate),
      assignee: assigneeId || null,
      createdBy: req.user._id,
    });

    const populated = await Task.findById(task._id).populate("assignee");
    res.status(201).json(populated);
  } catch (error) {
    console.error("[Tasks] createTask error:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description, status, dueDate, assigneeId, priority, labels, kanbanColumn, column } =
      req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (priority !== undefined) task.priority = priority;
    if (labels !== undefined) task.labels = Array.isArray(labels) ? labels : [];
    if (dueDate !== undefined) task.dueDate = parseDueDate(dueDate);
    if (assigneeId !== undefined) task.assignee = assigneeId || null;

    const col = kanbanColumn || column;
    if (col !== undefined) {
      task.kanbanColumn = col;
      task.status = status || statusFromColumn(col);
    } else if (status !== undefined) {
      task.status = status;
    }

    await task.save();
    const updatedTask = await Task.findById(task._id).populate("assignee");
    res.json(updatedTask);
  } catch (error) {
    console.error("[Tasks] updateTask error:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await task.deleteOne();
    res.json({ message: "Task removed" });
  } catch (error) {
    console.error("[Tasks] deleteTask error:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
