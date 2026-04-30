import { connection, Questions } from "@letscode/databases/models";
import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});


console.log("Service is on")

cron.schedule("0 14 * * *", async () => {
  try {
    await connection(process.env.DB!);
    const currentDate = new Date().getDate();
    let currentMonth = (new Date().getMonth() + 1).toLocaleString();
    const currentYear = new Date().getFullYear();

    if (parseInt(currentMonth) < 10) {
      currentMonth = "0" + currentMonth.toLocaleString();
    }

    const fullDate = currentYear + "-" + currentMonth + "-" + currentDate;
    console.log(fullDate);

    const question = await Questions.findOne({
      // @ts-ignore
      publishingDate: fullDate.toString(),
    });

    console.log(question)
    if (!question) {
      console.log("question not found");
      return;
    }

    // @ts-ignore
    const info = await Questions.findOneAndUpdate(
      {
        publishingDate: fullDate.toString(),
      },
      {
        isVisible: true,
      },
    );
      //   @ts-ignore
    if (!info?.isVisible) {
      console.log("Re run");
      //   @ts-ignore
      await Questions.findOneAndUpdate(
        {
          publishingDate: fullDate.toString(),
        },
        {
          isVisible: true,
        },
      );
    }
    console.log("cron run");
  } catch (error) {
    throw new Error(String(error))
  }
},{
  timezone:'Asia/Kolkata'
});
