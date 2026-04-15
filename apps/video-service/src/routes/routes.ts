import { Hono } from "hono";
import {VideoController} from "../controllers/controller.js"

export const router = new Hono();

const videocontroller = new VideoController();

router.get("/health",videocontroller.healthcheck);


