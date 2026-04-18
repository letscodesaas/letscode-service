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
};

export const ENV = Object.freeze(_ENV);
