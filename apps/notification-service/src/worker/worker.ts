import { Worker } from "worker_threads";

export const worker = async (path: string,data:any) => {
  const w = new Worker(path,{
    workerData:data
  });
  return new Promise((resolve, reject) => {
    w.on("message", (value) => {
      resolve(value);
    });
    w.on("error", (err) => {
      reject(err);
    });

    w.on("exit", (code) => {
      if(code != 0){
        reject(`exist code is - ${code}`);
      }
    });
  });
};
