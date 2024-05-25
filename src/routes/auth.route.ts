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
} from "../controllers/auth.controller";

const authRoutes = Router();

// prefix: /auth

authRoutes.route("/signup").get(renderSignup).post(registerHandler);
authRoutes.route("/login").get(renderLogin).post(loginHandler);

authRoutes.get("/refresh", refreshHandler);
authRoutes.get("/logout", logoutHandler);
authRoutes.get("/email/verify/:code", verifyEmailHandler);
authRoutes.post("/password/forgot", sendPasswordResetHandler);
authRoutes.post("/password/reset", resetPasswordHandler);

export default authRoutes;
