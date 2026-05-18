export const AVATAR_COLORS = [
  "from-pink-400 to-rose-500",
  "from-cyan-400 to-blue-500",
  "from-violet-400 to-purple-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-indigo-400 to-violet-500",
];

export const TEAM_ROLES = [
  { value: "team-lead", label: "Team Lead" },
  { value: "manager", label: "Manager" },
  { value: "member", label: "Team Member" },
];

export const getRoleLabel = (role) =>
  TEAM_ROLES.find((r) => r.value === role)?.label || role || "Member";

export const normalizeMember = (m) => {
  if (!m) return null;
  const id = m._id || m.id;
  return {
    id,
    _id: id,
    name: m.name,
    email: m.email || "",
    role: m.role || "member",
    color: m.color || AVATAR_COLORS[0],
  };
};

export const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

export const getAssigneeId = (task, meta = {}) => {
  if (!task) return null;
  if (task.assignee?._id) return task.assignee._id;
  if (typeof task.assignee === "string") return task.assignee;
  return meta?.assigneeId || null;
};

export const getMemberTaskCount = (memberId, tasks, metaMap = {}) =>
  tasks.filter((t) => getAssigneeId(t, metaMap[t._id]) === memberId).length;

export const resolveAssignee = (task, meta, getMember) => {
  if (task?.assignee && typeof task.assignee === "object" && task.assignee.name) {
    return normalizeMember(task.assignee);
  }
  const id = getAssigneeId(task, meta);
  return id ? getMember(id) : null;
};
