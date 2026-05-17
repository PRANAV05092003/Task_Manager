import { createContext, useContext, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { DEFAULT_TEAM, AVATAR_COLORS } from "../utils/teamHelpers.js";
import { makeId } from "../utils/taskHelpers.js";
import { useTasks } from "./TasksContext.jsx";

const TEAM_KEY = "ithara_team";

const loadTeam = () => {
  try {
    const raw = localStorage.getItem(TEAM_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* ignore */
  }
  localStorage.setItem(TEAM_KEY, JSON.stringify(DEFAULT_TEAM));
  return DEFAULT_TEAM;
};

const TeamContext = createContext(null);

export const TeamProvider = ({ children }) => {
  const [members, setMembers] = useState(loadTeam);
  const { metaMap, persistMeta } = useTasks();

  const save = useCallback((next) => {
    setMembers(next);
    localStorage.setItem(TEAM_KEY, JSON.stringify(next));
  }, []);

  const getMember = useCallback((id) => members.find((m) => m.id === id) || null, [members]);

  const addMember = useCallback(
    ({ name, email = "", role = "Member", color }) => {
      const trimmed = name?.trim();
      if (!trimmed) {
        toast.error("Name is required");
        return null;
      }
      const member = {
        id: makeId().replace("local_", "tm_"),
        name: trimmed,
        email: email.trim(),
        role: role.trim() || "Member",
        color: color || AVATAR_COLORS[members.length % AVATAR_COLORS.length],
      };
      save([...members, member]);
      toast.success(`${member.name} added to team`);
      return member;
    },
    [members, save]
  );

  const updateMember = useCallback(
    (id, updates) => {
      const trimmed = updates.name?.trim();
      if (updates.name !== undefined && !trimmed) {
        toast.error("Name is required");
        return false;
      }
      const next = members.map((m) =>
        m.id === id
          ? {
              ...m,
              ...(updates.name !== undefined && { name: trimmed }),
              ...(updates.email !== undefined && { email: updates.email.trim() }),
              ...(updates.role !== undefined && { role: updates.role.trim() || "Member" }),
              ...(updates.color !== undefined && { color: updates.color }),
            }
          : m
      );
      save(next);
      toast.success("Team member updated");
      return true;
    },
    [members, save]
  );

  const deleteMember = useCallback(
    (id) => {
      const member = members.find((m) => m.id === id);
      if (!member) return;

      const nextMeta = { ...metaMap };
      let cleared = 0;
      Object.keys(nextMeta).forEach((taskId) => {
        if (nextMeta[taskId]?.assigneeId === id) {
          nextMeta[taskId] = { ...nextMeta[taskId], assigneeId: null };
          cleared++;
        }
      });
      if (cleared > 0) persistMeta(nextMeta);

      save(members.filter((m) => m.id !== id));
      toast.success(`${member.name} removed from team`);
    },
    [members, metaMap, persistMeta, save]
  );

  return (
    <TeamContext.Provider value={{ members, addMember, updateMember, deleteMember, getMember }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error("useTeam must be used within TeamProvider");
  return ctx;
};
