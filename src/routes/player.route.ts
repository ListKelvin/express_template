import { Router } from "express";

import {
  createPlayerHandler,
  deletePlayerHandler,
  getAllPlayerHandler,
  getPlayerByIdHandler,
  updatePlayerHandler,
} from "../controllers/player.controller";

const playerRoutes = Router();

//prefix: /player

playerRoutes.get("/", getAllPlayerHandler);
playerRoutes.get("/:id", getPlayerByIdHandler);
playerRoutes.put("/:id", updatePlayerHandler);
playerRoutes.post("/", createPlayerHandler);
playerRoutes.delete("/:id", deletePlayerHandler);

export default playerRoutes;
