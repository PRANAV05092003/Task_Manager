import Task from "../models/Task.js";

const parseDueDate = (value) => {
  if (!value || value === "") return null;
  return value;
};

export const getTasks = async (req, res) => {
  try {
    console.log("[Tasks] Fetch for user:", req.user._id);
    const tasks = await Task.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (error) {
    console.error("[Tasks] getTasks error:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const createTask = async (req, res) => {
  try {
    console.log("[Tasks] Create request:", req.body);
    const { title, description, status, dueDate } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || "",
      status: status || "pending",
      dueDate: parseDueDate(dueDate),
      createdBy: req.user._id,
    });

    console.log("[Tasks] Created:", task._id);
    res.status(201).json(task);
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

    const { title, description, status, dueDate } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = parseDueDate(dueDate);

    const updatedTask = await task.save();
    console.log("[Tasks] Updated:", updatedTask._id);
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
    console.log("[Tasks] Deleted:", req.params.id);
    res.json({ message: "Task removed" });
  } catch (error) {
    console.error("[Tasks] deleteTask error:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
