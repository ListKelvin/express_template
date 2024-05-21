import Joi from "joi";
import { NOT_FOUND, OK } from "../constant/http";
import NationModel from "../models/nation.model";
import {
  updateNationSchema,
  createNationSchema,
} from "../schema/nation.schema";
import {
  createNation,
  deleteNation,
  getAllNation,
  getNationById,
  updateNational,
} from "../services/nation.service";
import catchErrors from "../utils/catchErrors";
import validateRequest from "../utils/validateRequest";
import appAssert from "../utils/appAssert";
import AppErrorCodes from "../constant/appErrorCodes";
const { NotFound } = AppErrorCodes;
export const createNationHandler = catchErrors(async (req, res) => {
  const request = validateRequest(createNationSchema, {
    ...req.body,
  });
  console.log(request);

  const { nation } = await createNation(request);
  return res.status(OK).json(nation);
});

// chưa check chùng tên nation
export const updateNationHandler = catchErrors(async (req, res) => {
  const request = validateRequest(updateNationSchema, {
    ...req.body,
  });

  const { nation } = await updateNational(req.params.id, request);
  return res.status(OK).json(nation);
});

export const getAllNationHandler = catchErrors(async (req, res) => {
  const { nations } = await getAllNation();
  return res.status(OK).json(nations);
});
export const getNationByIdHandler = catchErrors(async (req, res) => {
  const nationId = validateRequest(Joi.string().required(), req.params.id);
  const { nation } = await getNationById(nationId);
  appAssert(nation, NotFound, "Nation not found", NOT_FOUND);
  return res.status(OK).json(nation);
});
export const deleteNationHandler = catchErrors(async (req, res) => {
  const nationId = validateRequest(Joi.string().required(), req.params.id);
  const { nation } = await deleteNation(nationId);
  appAssert(nation, NotFound, "Nation not found", NOT_FOUND);
  return res.status(OK).json({ nation: nation, message: "Nation removed" });
});
