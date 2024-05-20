import { Router } from "express";
import {
  getUserHandler,
  getAllUserHandler,
} from "../controllers/user.controller";

const userRoutes = Router();

// prefix: /user
userRoutes.get("/", getAllUserHandler);

userRoutes.get("/:id", getUserHandler);
export default userRoutes;
