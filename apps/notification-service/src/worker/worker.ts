import { Worker } from "worker_threads";

export const worker = async (path: string) => {
  const w = new Worker(path);
  return new Promise((resolve, reject) => {
    w.on("message", (value) => {
      resolve(value);
    });
    w.on("error", (err) => {
      reject(err);
    });

    w.on("exit", (code) => {
      reject(code);
    });
  });
};
