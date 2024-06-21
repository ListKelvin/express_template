import { Router } from "express";
import {
  getUserHandler,
  getAllUserHandler,
  getAllUserHandlerSSR,
  getUserHandlerSSR,
} from "../controllers/user.controller";
import { Authorization } from "../middleware/authorization";
import Roles from "../constant/roles";
import {
  changePasswordHandlerSSR,
  renderChangePasswordHandler,
} from "../controllers/auth.controller";

const userRoutes = Router();

// prefix: /user
userRoutes
  .route("/accounts")
  .get(Authorization([Roles.ADMIN]), getAllUserHandlerSSR);
userRoutes.route("/profile").get(getUserHandlerSSR);
userRoutes
  .route("/profile/changePassword")
  .get(renderChangePasswordHandler)
  .post(changePasswordHandlerSSR);
// userRoutes.get("/", getAllUserHandler);

// userRoutes.get("/:id", getUserHandler);
export default userRoutes;
