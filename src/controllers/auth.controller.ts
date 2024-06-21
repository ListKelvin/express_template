import AppErrorCodes from "../constant/appErrorCodes";
import { CREATED, NOT_FOUND, OK, UNAUTHORIZED } from "../constant/http";
import SessionModel from "../models/session.model";
import {
  changePasswordService,
  createAccount,
  loginUser,
  refreshUserAccessToken,
  resetPassword,
  sendPasswordResetEmail,
  verifyEmail,
} from "../services/auth.service";
import appAssert from "../utils/appAssert";
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  setAuthCookies,
} from "../utils/cookies";
import { verifyToken } from "../utils/jwt";
import catchErrors from "../utils/catchErrors";
import validateRequest from "../utils/validateRequest";
import {
  changePasswordMemberSchema,
  emailSchema,
  loginMemberSchema,
  loginSchema,
  registerMemberSchema,
  resetPasswordSchema,
  verificationCodeSchema,
} from "../schema/auth.schemas";
import VerificationCodeTypes from "../constant/verificationCodeTypes";
import VerificationCodeModel from "../models/verificationCode.model";
import { NextFunction, Response } from "express";
import Roles from "../constant/roles";
import MemberModal from "../models/member.model";

const { InvalidRefreshToken, NotFound } = AppErrorCodes;

export const renderLogin = (req: any, res: Response) => {
  try {
    res.render("./auth/login", {
      layout: false,
      // isLoggedIn: !!req.session.user,
      // user: req.session.user,
    });
  } catch (err: any) {
    res.render("404", {
      // isLoggedIn: !!req.session.user,
      // user: req.session.user,
    });
  }
};
export const renderSignup = (req: any, res: Response) => {
  try {
    res.render("./auth/signup", {
      layout: false,
      // isLoggedIn: !!req.session.user,
      // user: req.session.user,
    });
  } catch (err: any) {
    res.render("404", {
      isLoggedIn: !!req.session.user,
      user: req.session.user,
    });
  }
};
export const renderChangePasswordHandler = async (req: any, res: Response) => {
  const { payload } = verifyToken(req.cookies.accessToken);
  const member = await MemberModal.findOne({ _id: payload?.memberId });
  try {
    res.render("./members/changePassword", {
      isLoggedIn: !!req.cookies.accessToken,
      member: member?.role,
    });
  } catch (err: any) {
    res.render("404", {
      isLoggedIn: !!req.cookies.accessToken,
      member: member?.role,
    });
  }
};

export const registerHandler = catchErrors(async (req, res) => {
  const request = validateRequest(registerMemberSchema, {
    ...req.body,
    userAgent: req.headers["user-agent"],
  });
  const { member, accessToken, refreshToken } = await createAccount(request);

  return setAuthCookies({ res, accessToken, refreshToken }).redirect(
    "/auth/login"
  );

  // .json(member)
});
export const changePasswordHandlerSSR = catchErrors(async (req, res) => {
  const request = validateRequest(changePasswordMemberSchema, {
    ...req.body,
  });

  const { newMem } = await changePasswordService(request);
  console.log(newMem);

  return clearAuthCookies(res).redirect("/login");

  // .json(member)
});

export const loginHandler = catchErrors(async (req: any, res) => {
  const request = validateRequest(loginMemberSchema, {
    ...req.body,
    userAgent: req.headers["user-agent"],
  });
  const { accessToken, refreshToken, member, isValid } = await loginUser(
    request
  );

  if (isValid && member.role === Roles.ADMIN) {
    return setAuthCookies({ res, accessToken, refreshToken }).redirect(
      "/watches/management"
    );
  }
  if (isValid && member.role === Roles.MEMBER) {
    return setAuthCookies({ res, accessToken, refreshToken }).redirect(
      "/watches"
    );
  }
  // set cookies
  return setAuthCookies({ res, accessToken, refreshToken }).redirect("/");
});

export const logoutHandlerSSR = catchErrors(async (req, res) => {
  const { accessToken } = req.cookies;
  const { payload } = verifyToken(accessToken);

  if (payload) {
    // remove session from db
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }

  // clear cookies
  return clearAuthCookies(res).redirect("/");
  // .status(OK)
  // .json({ message: "Logout successful" });
});

export const logoutHandler = catchErrors(async (req, res) => {
  const { accessToken } = req.cookies;
  const { payload } = verifyToken(accessToken);

  if (payload) {
    // remove session from db
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }

  // clear cookies
  return clearAuthCookies(res)
    .status(OK)
    .json({ message: "Logout successful" });
});

export const refreshHandler = catchErrors(async (req, res) => {
  const { refreshToken } = req.cookies;
  appAssert(
    refreshToken,
    InvalidRefreshToken,
    "Missing refresh token",
    UNAUTHORIZED
  );

  const accessToken = await refreshUserAccessToken(refreshToken);
  return res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({ message: "Access token refreshed" });
});

export const verifyEmailHandler = catchErrors(async (req, res) => {
  const verificationCode = validateRequest(
    verificationCodeSchema,
    req.params.code
  );
  await verifyEmail(verificationCode);
  return res.status(OK).json({ message: "Email was successfully verified" });
});

export const sendPasswordResetHandler = catchErrors(async (req, res) => {
  const email = validateRequest(emailSchema, req.body.email);
  await sendPasswordResetEmail(email);
  return res.status(OK).json({ message: "Password reset email sent" });
});

export const verifyPasswordResetHandler = catchErrors(async (req, res) => {
  const code = validateRequest(verificationCodeSchema, req.params.code);
  const verificationCode = await VerificationCodeModel.findOne({
    _id: code,
    type: VerificationCodeTypes.PASSWORD_RESET,
    expiresAt: { $gt: new Date() },
  });

  appAssert(verificationCode, NotFound, "Invalid Link", NOT_FOUND);
  return res.status(OK).json({ message: "Link is valid" });
});

export const resetPasswordHandler = catchErrors(async (req, res) => {
  const request = validateRequest(resetPasswordSchema, req.body);
  await resetPassword(request);
  return clearAuthCookies(res)
    .status(OK)
    .json({ message: "Password was reset successfully" });
});
export const logout = async (req: Request, res: Response) => {
  clearAuthCookies(res);
  res.redirect("/");
};
