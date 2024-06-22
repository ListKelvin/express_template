import { Router } from "express";
import { Authorization } from "../middleware/authorization";
import Roles from "../constant/roles";
import { createCommentHandler } from "../controllers/comment.controller";

const commentRouter = Router();

commentRouter
  .route("/")
  .post(Authorization([Roles.MEMBER]), createCommentHandler);
export default commentRouter;
