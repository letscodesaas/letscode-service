import mongoose from "mongoose";

const emailContentSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
    },
    html: {
      type: String,
    },
    category: {
      type: String,
    },
    topic: {
      type: String,
    },
    status:{
      type:Boolean,
      default:true
    }
  },
  { timestamps: true },
);

export const EmailContent =
  mongoose.models.emailcontent ||
  mongoose.model("emailcontent", emailContentSchema);
