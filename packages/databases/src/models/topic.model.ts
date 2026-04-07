import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      unique: true,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Topics =
  mongoose.models.topic || mongoose.model("topic", topicSchema);
