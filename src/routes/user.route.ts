import { Router } from "express";
import {
  getUserHandler,
  getAllUserHandler,
  getAllUserHandlerSSR,
} from "../controllers/user.controller";
import { Authorization } from "../middleware/authorization";
import Roles from "../constant/roles";

const userRoutes = Router();

// prefix: /user
userRoutes
  .route("/accounts")
  .get(Authorization([Roles.ADMIN]), getAllUserHandlerSSR);

// userRoutes.get("/", getAllUserHandler);

// userRoutes.get("/:id", getUserHandler);
export default userRoutes;
