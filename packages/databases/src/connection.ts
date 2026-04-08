import mongoose from "mongoose";

export const connection = async (uri: string) => {
  try {
    await mongoose.connect(uri);
    console.log("connected");
  } catch (error) {
    throw new Error(String(error));
  }
};
