import jwt, { VerifyOptions, SignOptions } from "jsonwebtoken";
import Roles from "../constant/roles";
import { JWT_SECRET } from "../constant/env";
import { User } from "../models/user.model";
import { SessionDocument } from "../models/session.model";

const ACCESS_TOKEN_EXP = "15m";
export const REFRESH_TOKEN_EXP = "30d";

export type RefreshToken = {
  sessionId: SessionDocument["_id"];
};

export type AccessToken = {
  userId: User["_id"];
  sessionId: SessionDocument["_id"];
};

export const signToken = (
  payload: AccessToken | RefreshToken,
  options?: SignOptions & {
    secret?: string;
  }
) => {
  const { secret = JWT_SECRET, ...opts } = options || {};
  return jwt.sign(payload, secret, {
    audience: [Roles.USER],
    expiresIn: ACCESS_TOKEN_EXP,
    ...opts,
  });
};

export const verifyToken = <T extends object = AccessToken>(
  token: string,
  options?: VerifyOptions & {
    secret?: string;
  }
) => {
  const { secret = JWT_SECRET, ...opts } = options || {};
  try {
    const payload = jwt.verify(token, secret, {
      audience: [Roles.USER],
      ...opts,
    }) as T;
    return {
      payload,
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
