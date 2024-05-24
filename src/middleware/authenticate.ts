import { RequestHandler } from "express";
import appAssert from "../utils/appAssert";
import AppErrorCodes from "../constant/appErrorCodes";
import { UNAUTHORIZED } from "../constant/http";
import { verifyToken } from "../utils/jwt";

const { InvalidAccessToken } = AppErrorCodes;

// wrap with catchErrors() if you need this to be async
const authenticate: RequestHandler = (req, res, next) => {
  const { accessToken } = req.cookies;
  appAssert(accessToken, InvalidAccessToken, "Not authorized", UNAUTHORIZED);

  const { error, payload } = verifyToken(accessToken);
  appAssert(
    payload,
    InvalidAccessToken,
    error === "jwt expired" ? "Token expired" : "Invalid token",
    UNAUTHORIZED
  );
  req.userId = payload.memberId;
  req.sessionId = payload.sessionId;
  next();
};

export default authenticate;
