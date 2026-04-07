import mongoose from "mongoose";

const logsSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
    },
  },
  {
    timestamps:true
  },
);

export const LogsEvent =
  mongoose.models.notification ||
  mongoose.model("logs", logsSchema);
