import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

const _ENV = {
  DB: process.env.DB
    ? process.env.DB
    : (() => {
        throw new Error("DB URL is required");
      })(),

  IMAGE_KIT: process.env.IMAGE_KIT
    ? process.env.IMAGE_KIT
    : (() => {
        throw new Error("IMAGE_KIT URL is required");
      })(),
};

export const ENV = Object.freeze(_ENV);
