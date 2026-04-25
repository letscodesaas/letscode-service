import type { Context } from "hono";
import { Goodies, Variant } from "@letscode/databases/models";
import { ImageKitConfig } from "../config/imagekit.config.js";
import { ENV } from "../env/env.js";
export class Controller {
  public async goodies(c: Context) {
    try {
      const response = await Goodies.find().populate("variants");
      c.status(200);
      return c.json({ message: "success", data: response });
    } catch (error) {
      c.status(500);
      return c.json({ message: "Internal server error" });
    }
  }

  public async goodie(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) {
        c.status(404);
        return c.json({ message: "product id is required" });
      }
      //   @ts-ignore
      const response = await Goodies.findById(id).populate("variants");
      c.status(200);
      return c.json({ message: "success", data: response });
    } catch (error) {
      c.status(500);
      return c.json({ message: "Internal server error" });
    }
  }

  public async addGoodie(c: Context) {
    try {
      const data = await c.req.formData();
      const variant = [];
      const productLinks = [];
      const imagekit = new ImageKitConfig(ENV.IMAGE_KIT);
      const title = data.get("title");
      const description = data.get("description");
      const types = data.get("types");
      const variants = data.get("variants");
      const images = data.get("images");

      if (!title || description || !types || !variants || !images) {
        c.status(402);
        return c.json({ message: "Add field are required" });
      }

      if (!Array.isArray(variants) || !Array.isArray(images)) {
        c.json(402);
        return c.json({
          message: "Variant and images are expected to be array",
        });
      }

      if (Array.isArray(variants)) {
        for (const v of variants) {
          const imageLink = await imagekit.uploadImage(v.images as File, "");
          const info = await Variant.create({
            title: v.title,
            description: v.description,
            points: v.points,
            images: imageLink,
          });
          variant.push(info);
        }
      }

      if (Array.isArray(images)) {
        for (const i of images) {
          const links = await imagekit.uploadImage(i as File, "");
          productLinks.push(links);
        }
      }
      //   @ts-ignore
      await Goodies.create({
        title,
        description,
        types,
        variants: variant,
        images: productLinks,
      });
      c.status(201);
      return c.json({ message: "success" });
    } catch (error) {
      c.status(500);
      return c.json({ message: "Internal server error" });
    }
  }


  public async updateGoodie(c:Context){
    
  }
}
