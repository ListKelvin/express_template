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

export const getAllWatchHandler = catchErrors(async (req, res) => {
  const { watchs } = await getAllWatch();
  return res.status(OK).json(watchs);
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
