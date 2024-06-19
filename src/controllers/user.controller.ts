// @ts-nocheck
import { NotFound } from "../constant/appErrorCodes";
import { NOT_FOUND, OK } from "../constant/http";
import Roles from "../constant/roles";
import MemberModal from "../models/member.model";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";

export const getUserHandler = catchErrors(async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  appAssert(user, NotFound, "User not found", NOT_FOUND);
  return res.status(OK).json(user.omitPassword());
});
export const getAllUserHandler = catchErrors(async (req, res) => {
  const user = await UserModel.find();
  return res.status(OK).json(user);
});

export const getAllUserHandlerSSR = catchErrors(async (req, res) => {
  try {
    const members = await MemberModal.find(
      {
        role: {
          $ne: Roles.ADMIN,
        },
      },
      "-password"
    ).lean();
    res.render("./users/management", {
      members,
      isLoggedIn: !!req.cookies.accessToken,
      user: req.cookies.accessToken,
    });
  } catch (err: any) {
    res.render("404", {
      isLoggedIn: !!req.cookies.accessToken,
      user: req.cookies.accessToken,
    });
  }
});
