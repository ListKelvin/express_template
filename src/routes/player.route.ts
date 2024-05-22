import { Router } from "express";
import {
  createNationHandler,
  deleteNationHandler,
  getAllNationHandler,
  getNationByIdHandler,
  updateNationHandler,
} from "../controllers/nation.controller";
import { createPlayerHandler } from "../controllers/player.controller";

const playerRoutes = Router();

//prefix: /player

playerRoutes.get("/", getAllNationHandler);
playerRoutes.get("/:id", getNationByIdHandler);
playerRoutes.put("/:id", updateNationHandler);
playerRoutes.post("/", createPlayerHandler);
playerRoutes.delete("/:id", deleteNationHandler);

export default playerRoutes;
