// @ts-nocheck
import { NotFound } from "../constant/appErrorCodes";
import { NOT_FOUND, OK } from "../constant/http";
import Roles from "../constant/roles";
import MemberModal from "../models/member.model";
import UserModel from "../models/user.model";
import { updateMemberSchema } from "../schema/auth.schemas";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import { verifyToken } from "../utils/jwt";

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
  const { payload } = verifyToken(req.cookies.accessToken);
  const memberToken = await MemberModal.findOne({ _id: payload?.memberId });
  try {
    const members = await MemberModal.find(
      {
        role: {
          $ne: Roles.ADMIN,
        },
      },
      "-password"
    ).lean();
    res.render("./members/management", {
      members,
      isLoggedIn: !!req.cookies.accessToken,
      member: memberToken?.role,
    });
  } catch (err: any) {
    res.render("404", {
      isLoggedIn: !!req.cookies.accessToken,
      member: memberToken?.role,
    });
  }
});
export const getUserHandlerSSR = catchErrors(async (req, res) => {
  const { payload } = verifyToken(req.cookies.accessToken);
  const profile = await MemberModal.findOne({ _id: payload?.memberId }).lean();
  try {
    res.render("./members/profile", {
      profile,
      isLoggedIn: !!req.cookies.accessToken,
      member: profile?.role,
    });
  } catch (err: any) {
    res.render("404", {
      isLoggedIn: !!req.cookies.accessToken,
      member: profile?.role,
    });
  }
});

export const updateProfileHandler = catchErrors(async (req, res) => {
  const request = validateRequest(updateMemberSchema, {
    ...req.body,
  });

  const updateProfile = await MemberModal.findByIdAndUpdate(req.body.id, data, {
    new: true,
  });

  return res.redirect("/member");
});
export const renderProfileHandler = catchErrors(async (req, res) => {
  const { payload } = verifyToken(req.cookies.accessToken);
  const member = await MemberModal.findOne({ _id: payload?.memberId });

  return res.render("./members/updateProfile", {
    profile: member,
    isLoggedIn: !!req.cookies.accessToken,

    member: member.role,
  });
});
