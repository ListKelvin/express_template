import { Router } from "express";
import {
  createBrandHandler,
  createBrandHandlerSSR,
  deleteBrandHandler,
  deleteBrandHandlerSSR,
  getAllBrandHandler,
  getBrandByIdHandler,
  renderAllBrandHandler,
  updateBrandHandler,
  updateBrandHandlerSSR,
} from "../controllers/brand.controller";

const brandRoutes = Router();

//prefix: /brands
brandRoutes
  .route("/management")
  .get(renderAllBrandHandler)
  .post(createBrandHandlerSSR);

brandRoutes
  .route("/management/:id")
  .post(updateBrandHandlerSSR)
  .delete(deleteBrandHandlerSSR);

brandRoutes.get("/", getAllBrandHandler);
brandRoutes.get("/:id", getBrandByIdHandler);
brandRoutes.put("/:id", updateBrandHandler);
brandRoutes.post("/", createBrandHandler);
brandRoutes.delete("/:id", deleteBrandHandler);

export default brandRoutes;
