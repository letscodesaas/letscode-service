import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    scheduled:{
      type:Boolean,
      default:false
    },
    eventProcessed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const NotificationEvent =
  mongoose.models.notification ||
  mongoose.model("notification", notificationSchema);
