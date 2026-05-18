import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: "" },
    role: {
      type: String,
      enum: ["team-lead", "manager", "member"],
      default: "member",
    },
    color: { type: String, default: "from-indigo-400 to-violet-500" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

export default TeamMember;
