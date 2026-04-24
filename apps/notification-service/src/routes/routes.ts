import { Hono } from "hono";
import { NotificationController } from "../controllers/controller.js";

export const router = new Hono();
const notificationController = new NotificationController();

router.post("/subscribe", notificationController.subscribe);
router.post("/unsubscribe", notificationController.unsubscribe);
router.post("/topic", notificationController.createTopic);
router.get("/topics", notificationController.topics);
router.delete("/topic/:id", notificationController.deleteTopics);
router.post("/bulkmail", notificationController.bulkMail);
router.post("/scheduled", notificationController.scheduleNotification);
router.get("/scheduled", notificationController.scheduleNotifications);
router.post("/upload-csv", notificationController.uploadmails);
router.post("/stats",notificationController.stats);
router.post("/events",notificationController.pushEventsAPI);
router.get("/emails/:topic",notificationController.managemails);
router.post("/emails",notificationController.managemail);