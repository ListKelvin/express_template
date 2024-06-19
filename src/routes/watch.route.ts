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
import Roles from "../constant/roles";
import { Authorization } from "../middleware/authorization";

const watchRoutes = Router();

//prefix: /watches
watchRoutes.route("/").get(renderAllWatchHandler);

watchRoutes
  .route("/management")
  .get(Authorization([Roles.ADMIN]), renderManagementWatches)
  .post(Authorization([Roles.ADMIN]), createWatchHandlerSSR);
watchRoutes
  .route("/management/:watchId")
  .post(Authorization([Roles.ADMIN]), updateWatchHandlerSSR)
  .delete(Authorization([Roles.ADMIN]), deleteWatchHandlerSSR);

watchRoutes.route("/search").post(searchWatches);
watchRoutes.route("/:watchId").get(renderGetWatchById);

// watchRoutes.get("/:id", getWatchByIdHandler);
watchRoutes.put("/:id", updateWatchHandler);
watchRoutes.post("/", createWatchHandler);
watchRoutes.delete("/:id", deleteWatchHandler);

export default watchRoutes;
