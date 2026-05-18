import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Mail, Briefcase } from "lucide-react";
import { useTeam } from "../../context/TeamContext.jsx";
import { useTasks } from "../../context/TasksContext.jsx";
import { getMemberTaskCount, getRoleLabel } from "../../utils/teamHelpers.js";
import MemberAvatar from "./MemberAvatar.jsx";
import TeamMemberModal from "./TeamMemberModal.jsx";

export default function TeamPanel() {
  const { members, loading, addMember, updateMember, deleteMember } = useTeam();
  const { tasks, metaMap } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (member) => {
    setEditing(member);
    setModalOpen(true);
  };

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editing) {
        const ok = await updateMember(editing.id, form);
        if (ok) {
          setModalOpen(false);
          setEditing(null);
        }
      } else {
        const member = await addMember(form);
        if (member) {
          setModalOpen(false);
          setEditing(null);
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (member) => {
    if (window.confirm(`Remove ${member.name} from the team? Their assigned tasks will be unassigned.`)) {
      deleteMember(member.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[var(--text-muted)] text-sm">
            Manage your team, update names and roles, and assign tasks to members.
          </p>
        </div>
        <button type="button" onClick={openAdd} className="btn-primary flex items-center gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add team member
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-40 rounded-2xl" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-[var(--text-muted)] mb-4">No team members yet</p>
          <button type="button" onClick={openAdd} className="btn-primary">
            Add your first member
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member, i) => {
            const taskCount = getMemberTaskCount(member.id, tasks, metaMap);
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-5 group"
              >
                <div className="flex items-start gap-4">
                  <MemberAvatar member={member} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--text-primary)] truncate">{member.name}</h3>
                    <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                      <Briefcase className="w-3 h-3" /> {getRoleLabel(member.role)}
                    </p>
                    {member.email && (
                      <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-1 truncate">
                        <Mail className="w-3 h-3 shrink-0" /> {member.email}
                      </p>
                    )}
                    <p className="text-xs text-indigo-400 mt-2 font-medium">
                      {taskCount} task{taskCount !== 1 ? "s" : ""} assigned
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => openEdit(member)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--hover)] border border-[var(--border)]"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(member)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 border border-red-500/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <TeamMemberModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        initial={editing}
        loading={saving}
      />
    </div>
  );
}
