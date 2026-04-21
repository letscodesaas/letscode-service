import mongoose from "mongoose";

const goodiesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    types: {
      type: String,
      required: true,
    },
    variants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "variants",
    },
    images: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true },
);

export const Goodies =
  mongoose.models.goodie || mongoose.model("goodie", goodiesSchema);
