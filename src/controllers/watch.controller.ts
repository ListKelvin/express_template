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
const { NotFound } = AppErrorCodes;
export const createWatchHandler = catchErrors(async (req, res) => {
  const request = validateRequest(createWatchSchema, {
    ...req.body,
  });
  console.log(request);

  const { watch } = await createWatch(request);

  return res.status(OK).json(watch);
});

// chưa check chùng tên nation
export const updateWatchHandler = catchErrors(async (req, res) => {
  const request = validateRequest(updateWatchSchema, {
    ...req.body,
  });

  const { watch } = await updateWatch(req.params.id, request);
  return res.status(OK).json(watch);
});

export const renderAllWatchHandler = async (req: any, res: Response) => {
  try {
    const brandName = req.query.brandName;
    const searchQuery = req.query.searchQuery;
    const { watches } = await getAllWatch({ brandName, searchQuery });
    return res.render("./watches/watches", {
      watches,
      search: searchQuery,
      brandName: brandName,
      // isLoggedIn: !!req.session.user,
      // user: req.session.user,
    });
  } catch (err: any) {
    res.render("404", {});
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
