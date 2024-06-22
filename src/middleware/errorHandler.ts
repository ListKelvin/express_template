import Joi, { ValidationError } from "joi";
import { Response, ErrorRequestHandler, Request } from "express";
import AppError from "../utils/AppError";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constant/http";
import AppErrorCodes from "../constant/appErrorCodes";
import { clearAuthCookies } from "../utils/cookies";

const handleValidationError = (
  req: Request,
  res: Response,
  error: ValidationError
) => {
  const errors = error.details.map((detail) => ({
    key: detail.context?.key,
    message: detail.message,
  }));

  // Extract the original URL from the request (excluding query parameters)
  const originalUrl = "." + req.url;

  if (originalUrl.includes("./members/changePassword")) {
    res.render(originalUrl, {
      error: error,
      message: error.message,
    });
  } else {
    res.render(originalUrl, {
      layout: false,
      errors,
      error: error,
      message: error.message,
    });
  }

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
