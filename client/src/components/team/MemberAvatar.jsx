import { getInitials } from "../../utils/teamHelpers.js";

const sizes = {
  sm: "w-6 h-6 text-[10px]",
  md: "w-9 h-9 text-xs",
  lg: "w-11 h-11 text-sm",
};

export default function MemberAvatar({ member, size = "md", className = "" }) {
  if (!member) {
    return (
      <div
        className={`rounded-full bg-[var(--hover)] border border-dashed border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] ${sizes[size]} ${className}`}
        title="Unassigned"
      >
        ?
      </div>
    );
  }

  return (
    <div
      className={`rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold shrink-0 ${sizes[size]} ${className}`}
      title={member.name}
    >
      {getInitials(member.name)}
    </div>
  );
}
