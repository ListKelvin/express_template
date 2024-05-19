// @ts-nocheck
import { NotFound } from "../constant/appErrorCodes";
import { NOT_FOUND, OK } from "../constant/http";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";

export const getUserHandler = catchErrors(async (req, res) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, NotFound, "User not found", NOT_FOUND);
  return res.status(OK).json(user.omitPassword());
});
export const getAllUserHandler = catchErrors(async (req, res) => {
  const user = await UserModel.find();

  return res.status(OK).json(user);
});
