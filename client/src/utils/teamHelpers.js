export const AVATAR_COLORS = [
  "from-pink-400 to-rose-500",
  "from-cyan-400 to-blue-500",
  "from-violet-400 to-purple-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-indigo-400 to-violet-500",
];

export const DEFAULT_TEAM = [
  { id: "tm_1", name: "Alex Chen", email: "alex@ithara.ai", role: "Lead", color: AVATAR_COLORS[0] },
  { id: "tm_2", name: "Sam Rivera", email: "sam@ithara.ai", role: "Design", color: AVATAR_COLORS[1] },
  { id: "tm_3", name: "Jordan Lee", email: "jordan@ithara.ai", role: "Developer", color: AVATAR_COLORS[2] },
  { id: "tm_4", name: "Taylor Kim", email: "taylor@ithara.ai", role: "QA", color: AVATAR_COLORS[3] },
];

export const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

export const getMemberTaskCount = (memberId, tasks, metaMap) =>
  tasks.filter((t) => metaMap[t._id]?.assigneeId === memberId).length;
