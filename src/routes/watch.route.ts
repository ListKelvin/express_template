import { Router } from "express";
import {
  createWatchHandler,
  createWatchHandlerSSR,
  deleteWatchHandler,
  deleteWatchHandlerSSR,
  getAllWatchHandler,
  getWatchByIdHandler,
  renderAllWatchHandler,
  renderGetWatchById,
  renderManagementWatches,
  searchWatches,
  updateWatchHandler,
  updateWatchHandlerSSR,
} from "../controllers/watch.controller";

const watchRoutes = Router();

//prefix: /watches
watchRoutes.route("/").get(renderAllWatchHandler);

watchRoutes
  .route("/management")
  .get(renderManagementWatches)
  .post(createWatchHandlerSSR);
watchRoutes
  .route("/management/:watchId")
  .post(updateWatchHandlerSSR)
  .delete(deleteWatchHandlerSSR);
watchRoutes.route("/search").post(searchWatches);
watchRoutes.route("/:watchId").get(renderGetWatchById);

// watchRoutes.get("/:id", getWatchByIdHandler);
watchRoutes.put("/:id", updateWatchHandler);
watchRoutes.post("/", createWatchHandler);
watchRoutes.delete("/:id", deleteWatchHandler);

export default watchRoutes;
