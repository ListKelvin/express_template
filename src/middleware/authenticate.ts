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
  if (accessToken) {
    next();
  } else {
    res.render("400", { error: "Not authorized" });
  }
  const { error, payload } = verifyToken(accessToken);
  appAssert(
    payload,
    InvalidAccessToken,
    error === "jwt expired" ? "Token expired" : "Invalid token",
    UNAUTHORIZED
  );

  if (payload.memberId && payload.sessionId) {
    next();
  } else {
    res.render("/", {
      error: error === "jwt expired" ? "Token expired" : "Invalid token",
    });
  }
  req.userId = payload.memberId;
  req.sessionId = payload.sessionId;
  // next();
};

export default authenticate;
