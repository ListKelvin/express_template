import AppErrorCodes from "../constant/appErrorCodes";
import { APP_ORIGIN, JWT_REFRESH_SECRET } from "../constant/env";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
  UNPROCESSABLE_CONTENT,
} from "../constant/http";
import Roles from "../constant/roles";
import VerificationCodeTypes from "../constant/verificationCodeTypes";
import MemberModal, { Member } from "../models/member.model";
import SessionModel, { SessionDocument } from "../models/session.model";
import UserModel, { User } from "../models/user.model";
import VerificationCodeModel, {
  VerificationCodeDocument,
} from "../models/verificationCode.model";
import appAssert from "../utils/appAssert";
import { hashValue } from "../utils/bcrypt";
import { fiveMinutesAgo, oneHourFromNow, oneYearFromNow } from "../utils/date";
import {
  getPasswordResetTemplate,
  getVerifyEmailTemplate,
} from "../utils/emailTemplates";
import {
  REFRESH_TOKEN_EXP,
  RefreshToken,
  signToken,
  verifyToken,
} from "../utils/jwt";
import { sendMail } from "../utils/sendMail";

const {
  EmailInUse,
  InvalidCredentials,
  InvalidRefreshToken,
  NotFound,
  Unknown,
  RateLimitExceeded,
} = AppErrorCodes;

export const createAccount = async (
  data: Pick<Member, "email" | "memberName" | "password"> &
    Pick<SessionDocument, "userAgent">
) => {
  // verify email is not taken
  const existingMember = await MemberModal.exists({
    email: data.email,
  });
  appAssert(!existingMember, EmailInUse, "Email already in use", CONFLICT);

  const member = await MemberModal.create({
    email: data.email,
    memberName: data.memberName,
    password: data.password,
    role: Roles.MEMBER,
  });

  // send verification email
  const verificationCode = await VerificationCodeModel.create({
    memberId: member._id,
    type: VerificationCodeTypes.EMAIL_VERIFICATION,
    expiresAt: oneYearFromNow(),
  });

  const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;

  const { error } = await sendMail({
    to: member.email,
    ...getVerifyEmailTemplate(url),
  });
  // ignore email errors for now
  if (error) console.error(error);

  // create session
  const session = await SessionModel.create({
    memberId: member._id,
    userAgent: data.userAgent,
    createdAt: new Date(),
  });
  appAssert(
    session,
    Unknown,
    "Failed to create session",
    INTERNAL_SERVER_ERROR
  );

  // create refresh token
  const refreshToken = signToken(
    {
      sessionId: session._id,
    },
    {
      secret: JWT_REFRESH_SECRET,
      expiresIn: REFRESH_TOKEN_EXP,
    }
  );
  const accessToken = signToken({
    memberId: member._id,
    role: member.role,
    sessionId: session._id,
  });
  return { member: member.omitPassword(), accessToken, refreshToken };
};

export const loginUser = async ({
  memberName,
  password,
  userAgent,
}: Pick<Member, "memberName" | "password"> & { userAgent: string }) => {
  const member = await MemberModal.findOne({ memberName });
  appAssert(member, NotFound, "Invalid member or password", NOT_FOUND);

  const isValid = await member.comparePassword(password);
  appAssert(
    isValid,
    InvalidCredentials,
    "Invalid member name or password",
    UNAUTHORIZED
  );

  const memberId = member._id;
  const session = await SessionModel.create({
    memberId,
    userAgent,
    createdAt: new Date(),
  });
  appAssert(
    session,
    Unknown,
    "Failed to create session",
    INTERNAL_SERVER_ERROR
  );

  const sessionInfo: RefreshToken = {
    sessionId: session._id,
  };
  const refreshToken = signToken(sessionInfo, {
    secret: JWT_REFRESH_SECRET,
    expiresIn: REFRESH_TOKEN_EXP,
  });

  const accessToken = signToken({ ...sessionInfo, memberId });
  return { accessToken, refreshToken, member };
};

export const verifyEmail = async (code: VerificationCodeDocument["_id"]) => {
  const validCode = await VerificationCodeModel.findOne({
    _id: code,
    type: VerificationCodeTypes.EMAIL_VERIFICATION,
    expiresAt: { $gt: new Date() },
  });
  appAssert(
    validCode,
    NotFound,
    "Invalid verification code",
    UNPROCESSABLE_CONTENT
  );

  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.memberId,
    {
      verified: true,
    },
    { new: true }
  );
  appAssert(updatedUser, NotFound, "User not found", CONFLICT);

  await VerificationCodeModel.findByIdAndDelete(validCode._id);

  return { user: updatedUser.omitPassword() };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshToken>(refreshToken, {
    secret: JWT_REFRESH_SECRET,
  });

  appAssert(
    payload,
    InvalidRefreshToken,
    "Invalid refresh token",
    UNAUTHORIZED
  );

  // get the session
  const session = await SessionModel.findById(payload.sessionId);
  appAssert(
    session,
    InvalidRefreshToken,
    "Refresh token is no longer valid",
    UNAUTHORIZED
  );

  // create new access token
  const accessToken = signToken({
    memberId: session.userId,
    sessionId: session._id,
  });

  return accessToken;
};

export const sendPasswordResetEmail = async (email: User["email"]) => {
  const member = await MemberModal.findOne({ email });
  appAssert(member, NotFound, "User not found", UNPROCESSABLE_CONTENT);

  // check for max password reset requests (2 emails in 5min)
  const fiveMinAgo = fiveMinutesAgo();
  const count = await VerificationCodeModel.countDocuments({
    memberId: member._id,
    type: VerificationCodeTypes.PASSWORD_RESET,
    createdAt: { $gt: fiveMinAgo },
  });
  appAssert(
    count <= 1,
    RateLimitExceeded,
    "Too many requests, please try again later",
    TOO_MANY_REQUESTS
  );

  const expiresAt = oneHourFromNow();
  const verificationCode = await VerificationCodeModel.create({
    memberId: member._id,
    type: VerificationCodeTypes.PASSWORD_RESET,
    expiresAt,
  });

  const url = `${APP_ORIGIN}/password/reset?code=${
    verificationCode._id
  }&exp=${expiresAt.getTime()}`;

  const { data, error } = await sendMail({
    to: email,
    ...getPasswordResetTemplate(url),
  });

  appAssert(
    data?.id,
    Unknown,
    `${error?.name} - ${error?.message}`,
    INTERNAL_SERVER_ERROR
  );
  return {
    url,
    emailId: data.id,
  };
};

export const resetPassword = async ({
  verificationCode,
  password,
}: {
  verificationCode: VerificationCodeDocument["_id"];
  password: User["password"];
}) => {
  const validCode = await VerificationCodeModel.findOne({
    _id: verificationCode,
    type: VerificationCodeTypes.PASSWORD_RESET,
    expiresAt: { $gt: new Date() },
  });
  appAssert(
    validCode,
    NotFound,
    "This link is not valid",
    UNPROCESSABLE_CONTENT
  );

  const updatedUser = await UserModel.findByIdAndUpdate(validCode.memberId, {
    password: await hashValue(password),
  });
  appAssert(
    updatedUser,
    Unknown,
    "Failed to update user",
    INTERNAL_SERVER_ERROR
  );

  await VerificationCodeModel.findByIdAndDelete(validCode._id);

  // delete all sessions
  await SessionModel.deleteMany({ userId: validCode.memberId });

  return true;
};
