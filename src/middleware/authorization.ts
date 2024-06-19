import { NextFunction, Response } from "express";
import Roles from "../constant/roles";
import { AccessToken, verifyToken } from "../utils/jwt";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constant/env";

export const Authorization = (roles: Roles[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (req.cookies.accessToken) {
      const accessToken = req.cookies.accessToken;
      const { payload } = verifyToken<AccessToken>(accessToken, {
        secret: JWT_SECRET,
      });

      if (payload && roles.includes(payload.role)) {
        next();
      } else {
        res.render("404", {
          isLoggedIn: !!req.cookies.accessToken,
          user: req.cookies.accessToken,
        });
      }
    } else {
      res.render("404", {
        isLoggedIn: !!req.cookies.accessToken,
        user: req.cookies.accessToken,
      });
    }
  };
};
