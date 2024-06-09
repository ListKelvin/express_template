import { Router } from "express";
import {
  createWatchHandler,
  deleteWatchHandler,
  getAllWatchHandler,
  getWatchByIdHandler,
  renderAllWatchHandler,
  updateWatchHandler,
} from "../controllers/watch.controller";

const watchRoutes = Router();

//prefix: /watches/search

watchRoutes.route("/search").post(renderAllWatchHandler);

// watchRoutes.get("/:id", getWatchByIdHandler);
watchRoutes.put("/:id", updateWatchHandler);
watchRoutes.post("/", createWatchHandler);
watchRoutes.delete("/:id", deleteWatchHandler);

export default watchRoutes;
