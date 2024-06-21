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
import { Authorization } from "../middleware/authorization";
import Roles from "../constant/roles";

const brandRoutes = Router();

//prefix: /brands
brandRoutes
  .route("/management")
  .get(Authorization([Roles.ADMIN]), renderAllBrandHandler)
  .post(Authorization([Roles.ADMIN]), createBrandHandlerSSR);

brandRoutes
  .route("/management/:id")
  .post(Authorization([Roles.ADMIN]), updateBrandHandlerSSR)
  .delete(Authorization([Roles.ADMIN]), deleteBrandHandlerSSR);

brandRoutes.get("/", getAllBrandHandler);
brandRoutes.get("/:id", getBrandByIdHandler);
brandRoutes.put("/:id", updateBrandHandler);
brandRoutes.post("/", createBrandHandler);
brandRoutes.delete("/:id", deleteBrandHandler);

export default brandRoutes;
