import { initalCronJob } from "../crons/cron.js";
import { NotificationService } from "../services/notifcation.services.js";

const notificationService = new NotificationService();
export const execute_cron_job_thread = () => {
  initalCronJob("* * * * *", async () => {
    await notificationService.notify();
  });
};

execute_cron_job_thread();
