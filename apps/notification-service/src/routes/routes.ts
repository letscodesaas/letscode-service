import { Router as IttyRouter } from 'itty-router'
import {NotificationController} from "../controllers/controller.js"

export const router = IttyRouter();
const notificationController = new NotificationController();


router.post("/subscribe",notificationController.subscribe);
router.post("/unsubscribe",notificationController.unsubscribe);
router.post("/topic",notificationController.createTopic);
router.get("/topics",notificationController.topics);
router.delete("/topic/:id",notificationController.deleteTopics);
router.post("/bulkmail",notificationController.bulkMail);
router.post("/scheduled",notificationController.scheduleNotification);
router.get("/scheduled",notificationController.scheduleNotifications);