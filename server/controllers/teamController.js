import TeamMember from "../models/TeamMember.js";
import Task from "../models/Task.js";

const DEFAULT_MEMBERS = [
  { name: "Alex Chen", email: "alex@company.com", role: "team-lead", color: "from-pink-400 to-rose-500" },
  { name: "Sam Rivera", email: "sam@company.com", role: "manager", color: "from-cyan-400 to-blue-500" },
  { name: "Jordan Lee", email: "jordan@company.com", role: "member", color: "from-violet-400 to-purple-500" },
  { name: "Taylor Kim", email: "taylor@company.com", role: "member", color: "from-amber-400 to-orange-500" },
];

export const getTeamMembers = async (req, res) => {
  try {
    let members = await TeamMember.find({ createdBy: req.user._id }).sort({ createdAt: 1 });

    if (members.length === 0) {
      members = await TeamMember.insertMany(
        DEFAULT_MEMBERS.map((m) => ({ ...m, createdBy: req.user._id }))
      );
    }

    res.json(members);
  } catch (error) {
    console.error("[Team] getTeamMembers error:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const createTeamMember = async (req, res) => {
  try {
    const { name, email, role, color } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const member = await TeamMember.create({
      name: name.trim(),
      email: email?.trim() || "",
      role: role || "member",
      color: color || "from-indigo-400 to-violet-500",
      createdBy: req.user._id,
    });

    res.status(201).json(member);
  } catch (error) {
    console.error("[Team] createTeamMember error:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const updateTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }

    if (member.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { name, email, role, color } = req.body;
    if (name !== undefined) member.name = name.trim();
    if (email !== undefined) member.email = email.trim();
    if (role !== undefined) member.role = role;
    if (color !== undefined) member.color = color;

    const updated = await member.save();
    res.json(updated);
  } catch (error) {
    console.error("[Team] updateTeamMember error:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const deleteTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }

    if (member.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Task.updateMany(
      { createdBy: req.user._id, assignee: member._id },
      { $set: { assignee: null } }
    );

    await member.deleteOne();
    res.json({ message: "Team member removed" });
  } catch (error) {
    console.error("[Team] deleteTeamMember error:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
