import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    points: {
      type: String,
      required: true,
    },
    images: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Variant =
  mongoose.models.variant || mongoose.model("variant", variantSchema);
