import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});
const _ENV = {
  DB_URI: process.env.DB_URI
    ? process.env.DB_URI
    : (() => {
        throw new Error("DB connection uri required");
      })(),

  MAILTRAP_TOKEN: process.env.MAILTRAP_TOKEN
    ? process.env.MAILTRAP_TOKEN
    : (() => {
        throw new Error("Mailtrap token required");
      })(),

  ACCOUNT_ID: process.env.ACCOUNT_ID
    ? process.env.ACCOUNT_ID
    : (() => {
        throw new Error("Account id required");
      })(),
  DEV: process.env.DEV
    ? process.env.DEV
    : (() => {
        throw new Error("DEV required");
      })(),
  PORT: process.env.PORT
    ? process.env.PORT
    : (() => {
        throw new Error("PORT required");
      })(),
  REDIS_URL: process.env.REDIS_URL
    ? process.env.REDIS_URL
    : (() => {
        throw new Error("REDIS_URL required");
      })(),
};

export const ENV = Object.freeze(_ENV);
