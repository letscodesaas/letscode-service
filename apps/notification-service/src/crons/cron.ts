import nodeCron from "node-cron";

export const initalCronJob = (expression: string, cb: Function) => {
  nodeCron.schedule(expression, () => {
    cb();
  });
};
