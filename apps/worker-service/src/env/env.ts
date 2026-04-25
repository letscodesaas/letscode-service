import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});

const _ENV = {
  REDIS_URL: process.env.REDIS_URL
    ? process.env.REDIS_URL
    : (() => {
        throw new Error("Redis URL required");
      })(),
  MAILTRAP_TOKEN: process.env.MAILTRAP_TOKEN
    ? process.env.MAILTRAP_TOKEN
    : (() => {
        throw new Error("Mailtrap Token required");
      })(),
  ACCOUNT_ID: process.env.ACCOUNT_ID
    ? process.env.ACCOUNT_ID
    : (() => {
        throw new Error("Account ID required");
      })(),
  DB_URI: process.env.DB_URI
    ? process.env.DB_URI
    : (() => {
        throw new Error("DB_URI required");
      })(),
};

export const ENV = Object.freeze(_ENV);
