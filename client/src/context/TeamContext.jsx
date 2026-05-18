import { createContext, useContext, useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { normalizeMember, AVATAR_COLORS } from "../utils/teamHelpers.js";
import { useAuth } from "./AuthContext.jsx";

const TeamContext = createContext(null);

export const TeamProvider = ({ children }) => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMembers = useCallback(async () => {
    if (!user) {
      setMembers([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/team");
      setMembers(Array.isArray(data) ? data.map(normalizeMember) : []);
    } catch (err) {
      toast.error(err.message || "Failed to load team");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const getMember = useCallback(
    (id) => {
      if (!id) return null;
      return members.find((m) => m.id === id || m._id === id) || null;
    },
    [members]
  );

  const addMember = useCallback(
    async ({ name, email = "", role = "member", color }) => {
      const trimmed = name?.trim();
      if (!trimmed) {
        toast.error("Name is required");
        return null;
      }
      try {
        const { data } = await api.post("/team", {
          name: trimmed,
          email: email.trim(),
          role: role || "member",
          color: color || AVATAR_COLORS[members.length % AVATAR_COLORS.length],
        });
        const member = normalizeMember(data);
        setMembers((prev) => [...prev, member]);
        toast.success(`${member.name} added to team`);
        return member;
      } catch (err) {
        toast.error(err.message || "Failed to add member");
        return null;
      }
    },
    [members.length]
  );

  const updateMember = useCallback(async (id, updates) => {
    const trimmed = updates.name?.trim();
    if (updates.name !== undefined && !trimmed) {
      toast.error("Name is required");
      return false;
    }
    try {
      const { data } = await api.put(`/team/${id}`, {
        ...(updates.name !== undefined && { name: trimmed }),
        ...(updates.email !== undefined && { email: updates.email.trim() }),
        ...(updates.role !== undefined && { role: updates.role }),
        ...(updates.color !== undefined && { color: updates.color }),
      });
      const updated = normalizeMember(data);
      setMembers((prev) => prev.map((m) => (m.id === id ? updated : m)));
      toast.success("Team member updated");
      return true;
    } catch (err) {
      toast.error(err.message || "Failed to update member");
      return false;
    }
  }, []);

  const deleteMember = useCallback(
    async (id) => {
      try {
        await api.delete(`/team/${id}`);
        setMembers((prev) => prev.filter((m) => m.id !== id));
        toast.success("Team member removed");
      } catch (err) {
        toast.error(err.message || "Failed to remove member");
      }
    },
    []
  );

  return (
    <TeamContext.Provider
      value={{ members, loading, fetchMembers, addMember, updateMember, deleteMember, getMember }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error("useTeam must be used within TeamProvider");
  return ctx;
};
