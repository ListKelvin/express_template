import Joi, { ValidationError } from "joi";
import { Response, ErrorRequestHandler, Request } from "express";
import AppError from "../utils/AppError";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constant/http";
import AppErrorCodes from "../constant/appErrorCodes";
import { clearAuthCookies } from "../utils/cookies";
import { verifyToken } from "../utils/jwt";
import MemberModal from "../models/member.model";

const handleValidationError = async (
  req: Request,
  res: Response,
  error: ValidationError
) => {
  const errors = error.details.map((detail) => ({
    key: detail.context?.key,
    message: detail.message,
  }));
  const { payload } = verifyToken(req.cookies.accessToken);
  const member = await MemberModal.findOne({ _id: payload?.memberId });

  // Extract the original URL from the request (excluding query parameters)
  const originalUrl = "." + req.url;
  // console.log(originalUrl.startsWith("./watches"));

  if (originalUrl.includes("./members/changePassword")) {
    res.render(originalUrl, {
      error: error,
      message: error.message,
      isLoggedIn: !!req.cookies.accessToken,
      member: member?.role,
    });
  } else if (originalUrl.includes("./watches/management")) {
    res.render("400", {
      error: error,
      message: error.message,
      errorMessage: error.message,
      isLoggedIn: !!req.cookies.accessToken,
      member: member?.role,
    });
  } else {
    res.render(originalUrl, {
      layout: false,
      errors,
      error: error,
      message: error.message,
      isLoggedIn: !!req.cookies.accessToken,
      member: member?.role,
    });
  }
  //  else if (originalUrl.startsWith("./watches")) {
  //     res.render(`./watches/watchDetail`, {
  //       errors,
  //       error: error,
  //       message: error.message,
  //       isLoggedIn: !!req.cookies.accessToken,
  //       member: member?.role,
  //     });
  //   }
  // return res.status(BAD_REQUEST).json({
  //   errors,
  //   message: error.message,
  // });
};

const handleAppError = (req: Request, res: Response, error: AppError) => {
  if (error.errorCode === AppErrorCodes.InvalidRefreshToken) {
    clearAuthCookies(res);
  }
  const originalUrl = "." + req.url;

  if (originalUrl.includes("./members/changePassword")) {
    res.render(originalUrl, {
      error: error,
      message: error.message,
    });
  } else {
    // res.locals.error = error;
    res.render(originalUrl, {
      layout: false,

      error: error,
      message: error.message,
    });
  }

  // return res.status(error.statusCode).json({
  //   message: error.message,
  //   errorCode: error.errorCode,
  // });
};

const errorHandler: ErrorRequestHandler = (error, req: any, res, next) => {
  console.log(`PATH ${req.path}`, error);

  if (error instanceof Joi.ValidationError) {
    return handleValidationError(req, res, error);
  }

  if (error instanceof AppError) {
    return handleAppError(req, res, error);
  }

  // return res.status(INTERNAL_SERVER_ERROR).send("Internal server error");
  return res.render("404", {
    isLoggedIn: !!req.cookies.accessToken,
    user: req.cookies.accessToken,
  });
};

export default errorHandler;
