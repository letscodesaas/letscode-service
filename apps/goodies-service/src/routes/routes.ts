import { Hono } from "hono";
import {Controller} from "../controllers/controller.js";

const goodiesController = new Controller();


export const router = new Hono();

/* Goodies routes */
router.get("/goodies",goodiesController.goodies);
router.get("/goodie/:id",goodiesController.goodie);
router.post("/goodies",goodiesController.addGoodie);
router.patch("/goodies/:id");
router.delete("/goodies/:id");

/* Varient routes */
router.put("/varient/:id");
router.delete("/varient/:id");

/*Orders routes */
router.post("/order");
router.post("/cancelorder");


/*Shipping Aggrator */
router.post("/auth");
router.post("/syncorder");
router.post("/shippingstats");