import {initalCronJob} from "../crons/cron.js"

export const execute_cron_job_thread = () => {
    initalCronJob("* * * * *",()=>{
        console.log("notification-service")
    })
};

execute_cron_job_thread();
