import mongoose from "mongoose";

const notificationStatusSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      unique: false,
    },
    status: {
      type: String,
      default: "QUEUED",
    },
  },
  {
    timestamps: true,
  },
);

export const NotificationStatus =
  mongoose.models.notificationstatus ||
  mongoose.model("notificationstatus", notificationStatusSchema);
