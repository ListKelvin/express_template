import { Router } from "express";
import {
  createBrandHandler,
  deleteBrandHandler,
  getAllBrandHandler,
  getBrandByIdHandler,
  updateBrandHandler,
} from "../controllers/brand.controller";

const brandRoutes = Router();

//prefix: /brands

brandRoutes.get("/", getAllBrandHandler);
brandRoutes.get("/:id", getBrandByIdHandler);
brandRoutes.put("/:id", updateBrandHandler);
brandRoutes.post("/", createBrandHandler);
brandRoutes.delete("/:id", deleteBrandHandler);

export default brandRoutes;
