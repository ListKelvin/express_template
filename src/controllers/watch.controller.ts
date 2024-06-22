import Joi from "joi";
import { NOT_FOUND, OK } from "../constant/http";

import catchErrors from "../utils/catchErrors";
import validateRequest from "../utils/validateRequest";
import appAssert from "../utils/appAssert";
import AppErrorCodes from "../constant/appErrorCodes";
import {
  createWatch,
  deleteWatch,
  getAllWatch,
  getWatchById,
  updateWatch,
} from "../services/watch.service";
import { createWatchSchema, updateWatchSchema } from "../schema/watch.schemas";
import { Response } from "express";
import WatchModel from "../models/watch.model";
import { get } from "mongoose";
import BrandModel from "../models/brand.model";
import { verifyToken } from "../utils/jwt";
import MemberModal from "../models/member.model";
import CommentModel from "../models/comment.model";
import Roles from "../constant/roles";
const { NotFound } = AppErrorCodes;
export const createWatchHandler = catchErrors(async (req, res) => {
  const request = validateRequest(createWatchSchema, {
    ...req.body,
  });
  console.log(request);

  const { watch } = await createWatch(request);

  return res.status(OK).json(watch);
});
export const createWatchHandlerSSR = catchErrors(async (req, res: Response) => {
  const request = validateRequest(createWatchSchema, {
    ...req.body,
  });

  const { watch } = await createWatch(request);

  return res.redirect("/watches/management");
});

export const updateWatchHandlerSSR = catchErrors(async (req, res) => {
  const request = validateRequest(updateWatchSchema, {
    ...req.body,
  });

  const { watch } = await updateWatch(req.params.watchId, request);
  console.log(request);

  return res.redirect("/watches/management");
});
// chưa check chùng tên nation
export const updateWatchHandler = catchErrors(async (req, res) => {
  const request = validateRequest(updateWatchSchema, {
    ...req.body,
  });

  const { watch } = await updateWatch(req.params.id, request);
  return res.status(OK).json(watch);
});

export const searchWatches = async (req: any, res: Response) => {
  try {
    const watches = await WatchModel.find(
      {
        watchName: { $regex: req.body.search, $options: "i" },
        automatic: true,
      },
      {},
      {
        populate: "brandId",
      }
    )
      .lean()
      .select("watchName image brandId price");
    res.render("./watches/watches", {
      watches,
      search: req.body.search,
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
export const renderAllWatchHandler = async (req: any, res: Response) => {
  const { payload } = verifyToken(req.cookies.accessToken);
  const member = await MemberModal.findOne({ _id: payload?.memberId });
  try {
    const brandName = req.query.brandName;
    const searchQuery = req.query.searchQuery;
    const { watches } = await getAllWatch({ brandName, searchQuery });

    return res.render("./watches/watches", {
      watches,
      search: searchQuery,
      brandName: brandName,
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

export const renderManagementWatches = async (req: any, res: Response) => {
  const { payload } = verifyToken(req.cookies.accessToken);
  const member = await MemberModal.findOne({ _id: payload?.memberId });
  try {
    const brands = await BrandModel.find({}).lean();
    let watches = await WatchModel.find(
      {},
      {},
      {
        populate: "brandId",
      }
    ).lean();
    watches = watches.map((watch: any) => {
      watch["brand"] = watch["brandId"];
      watch["brandId"] = brands;
      return watch;
    });
    res.render("./watches/management", {
      watches,
      brands,
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

export const renderGetWatchById = async (req: any, res: Response) => {
  const { payload } = verifyToken(req.cookies.accessToken);
  const member = await MemberModal.findOne({ _id: payload?.memberId });
  try {
    const watch = await WatchModel.findOne(
      { _id: req.params?.watchId },
      {},
      {
        populate: ["brandId"],
      }
    );

    // const data = await Promise.all(
    //   watchơ.comments?.map(async (comment: any) => {
    //     const commentMessage = await CommentModel.find({ _id: comment })
    //       .populate("author")
    //       .lean();

    //     return commentMessage;
    //   })
    // );
    // console.log(data);
    const commentsss = await CommentModel.find({
      watchId: watch?._id,
    })
      .populate("author")
      .lean();

    const comment = await CommentModel.findOne({
      watchId: watch?._id,
      author: member?._id,
    });

    if (!watch) {
      res.render("404", {
        isLoggedIn: !!req.cookies.accessToken,
        member: member?.role,
      });
      return;
    }
    res.render("./watches/watchDetail", {
      _id: watch._id,
      watchName: watch.watchName,
      price: watch.price,
      image: watch.image,
      description: watch.watchDescription,
      // author: member,
      isAutomatic: watch.automatic,
      brandId: watch.brandId.brandName,
      comments: commentsss,
      // comments: data,
      commentCount: watch.comments?.length,
      isLoggedIn: !!req.cookies.accessToken,
      member: member?.role,
      canComment: member?.role === Roles.MEMBER && !comment,
    });
  } catch (err: any) {
    console.log(err);
    res.render("404", {
      isLoggedIn: !!req.cookies.accessToken,
      member: member?.role,
    });
  }
};

export const getAllWatchHandler = catchErrors(async (req, res) => {
  const brandName = req.query.brandName as string;
  const searchQuery = req.query.searchQuery as string;

  const { watches } = await getAllWatch({ brandName, searchQuery });
  return res.status(OK).json(watches);
});
export const getWatchByIdHandler = catchErrors(async (req, res) => {
  const watchId = validateRequest(Joi.string().required(), req.params.id);
  const { watch } = await getWatchById(watchId);
  appAssert(watch, NotFound, "Player not found", NOT_FOUND);
  return res.status(OK).json(watch);
});
export const deleteWatchHandler = catchErrors(async (req, res) => {
  const watchId = validateRequest(Joi.string().required(), req.params.id);
  const { watch } = await deleteWatch(watchId);
  appAssert(watch, NotFound, "Nation not found", NOT_FOUND);
  return res.status(OK).json({ watch: watch, message: "Nation removed" });
});

export const deleteWatchHandlerSSR = catchErrors(async (req, res) => {
  const watchId = validateRequest(Joi.string().required(), req.params.watchId);

  try {
    const { watch } = await deleteWatch(watchId);
    if (!watch) {
      res.status(NOT_FOUND).render("404", {
        // isLoggedIn: !!req.session.user,
        // user: req.session.user
      });
    }
  } catch (err: any) {
    res.render("404", {
      // isLoggedIn: !!req.session.user,
      // user: req.session.user
    });
  }
});
