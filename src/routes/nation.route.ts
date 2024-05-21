import { Router } from "express";
import {
  createNationHandler,
  deleteNationHandler,
  getAllNationHandler,
  getNationByIdHandler,
  updateNationHandler,
} from "../controllers/nation.controller";

const nationRoutes = Router();

//prefix: /nations

nationRoutes.get("/", getAllNationHandler);
nationRoutes.get("/:id", getNationByIdHandler);
nationRoutes.put("/:id", updateNationHandler);
nationRoutes.post("/", createNationHandler);
nationRoutes.delete("/:id", deleteNationHandler);

export default nationRoutes;
