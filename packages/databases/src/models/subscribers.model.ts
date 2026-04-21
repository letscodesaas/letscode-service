import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique:false,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    isSubscribed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Subscriber =
  mongoose.models.subscriber || mongoose.model("subscriber", subscriberSchema);
