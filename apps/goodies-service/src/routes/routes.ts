import { Hono } from "hono";
export const router = new Hono();

/* Goodies routes */
router.get("/goodies");
router.get("/goodie/:id");
router.post("/goodies");
router.patch("/goodies/:id");
router.delete("/goodies/:id");

/* Varient routes */
router.post("/varient");
router.put("/varient/:id");
router.delete("/varient/:id");

/*Orders routes */
router.post("/order");
router.post("/cancelorder");


/*Shipping Aggrator */
router.post("/auth");
router.post("/syncorder");
router.post("/shippingstats");