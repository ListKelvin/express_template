import { NextFunction, Response } from "express";
import Roles from "../constant/roles";

export const Authorization = (roles: Roles[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (req.session.user) {
      const user = req.session.user;
      if (roles.includes(user.role)) {
        next();
      } else {
        res.render("404", {
          isLoggedIn: !!req.session.user,
          user: req.session.user,
        });
      }
    } else {
      res.render("404", {
        isLoggedIn: !!req.session.user,
        user: req.session.user,
      });
    }
  };
};
