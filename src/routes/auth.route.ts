import { Router } from "express";
import {
  sendPasswordResetHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
  resetPasswordHandler,
  verifyEmailHandler,
  renderSignup,
  renderLogin,
  logoutHandlerSSR,
} from "../controllers/auth.controller";
import { AuthRoute } from "../middleware/authenticate";
import Roles from "../constant/roles";
import { Authorization } from "../middleware/authorization";

const authRoutes = Router();

// prefix: /auth

authRoutes.route("/signup").get(AuthRoute, renderSignup).post(registerHandler);
authRoutes.route("/login").get(AuthRoute, renderLogin).post(loginHandler);
authRoutes
  .route("/logout")
  .get(Authorization([Roles.ADMIN, Roles.MEMBER]), logoutHandlerSSR);

authRoutes.get("/refresh", refreshHandler);
// authRoutes.get("/logout", logoutHandler);
authRoutes.get("/email/verify/:code", verifyEmailHandler);
authRoutes.post("/password/forgot", sendPasswordResetHandler);
authRoutes.post("/password/reset", resetPasswordHandler);

export default authRoutes;
