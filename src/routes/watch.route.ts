import { Router } from "express";
import {
  createWatchHandler,
  deleteWatchHandler,
  getAllWatchHandler,
  getWatchByIdHandler,
  updateWatchHandler,
} from "../controllers/watch.controller";

const watchRoutes = Router();

//prefix: /watches

watchRoutes.get("/", getAllWatchHandler);
watchRoutes.get("/:id", getWatchByIdHandler);
watchRoutes.put("/:id", updateWatchHandler);
watchRoutes.post("/", createWatchHandler);
watchRoutes.delete("/:id", deleteWatchHandler);

export default watchRoutes;
