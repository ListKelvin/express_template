import { Router } from "express";
import {
  getUserHandler,
  getAllUserHandler,
} from "../controllers/user.controller";

const userRoutes = Router();

// prefix: /user
userRoutes.get("/", getUserHandler);

userRoutes.get("/all", getAllUserHandler);
export default userRoutes;
