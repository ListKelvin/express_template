import Joi from "joi";
import { NOT_FOUND, OK } from "../constant/http";

import {
  createBrand,
  deleteBrand,
  getAllBrand,
  getBrandById,
  updateBrand,
} from "../services/brand.service";
import catchErrors from "../utils/catchErrors";
import validateRequest from "../utils/validateRequest";
import appAssert from "../utils/appAssert";
import AppErrorCodes from "../constant/appErrorCodes";
import { createBrandSchema, updateBrandSchema } from "../schema/brand.schema";
import { verifyToken } from "../utils/jwt";
import MemberModal from "../models/member.model";
const { NotFound } = AppErrorCodes;
export const createBrandHandler = catchErrors(async (req, res) => {
  const request = validateRequest(createBrandSchema, {
    ...req.body,
  });
  console.log(request);

  const { brand } = await createBrand(request);
  return res.status(OK).json(brand);
});
export const createBrandHandlerSSR = catchErrors(async (req, res) => {
  const request = validateRequest(createBrandSchema, {
    ...req.body,
  });

  const { brand } = await createBrand(request);
  return res.redirect("/brands/management");
});
// chưa check chùng tên Brand
export const updateBrandHandler = catchErrors(async (req, res) => {
  const request = validateRequest(updateBrandSchema, {
    ...req.body,
  });

  const { brand } = await updateBrand(req.params.id, request);
  return res.status(OK).json(brand);
});

export const updateBrandHandlerSSR = catchErrors(async (req, res) => {
  const request = validateRequest(updateBrandSchema, {
    ...req.body,
  });

  const { brand } = await updateBrand(req.params.id, request);
  return res.redirect("/brands/management");
});

export const renderAllBrandHandler = catchErrors(async (req, res) => {
  const { brands } = await getAllBrand();
  const { payload } = verifyToken(req.cookies.accessToken);
  const member = await MemberModal.findOne({ _id: payload?.memberId });
  return res.render("./brands/brandManagement", {
    brands,
    isLoggedIn: !!req.cookies.accessToken,
    member: member?.role,
  });
});
export const getAllBrandHandler = catchErrors(async (req, res) => {
  const { brands } = await getAllBrand();
  return res.status(OK).json(brands);
});
export const getBrandByIdHandler = catchErrors(async (req, res) => {
  const BrandId = validateRequest(Joi.string().required(), req.params.id);
  const { brand } = await getBrandById(BrandId);
  appAssert(brand, NotFound, "Brand not found", NOT_FOUND);
  return res.status(OK).json(brand);
});
export const deleteBrandHandler = catchErrors(async (req, res) => {
  const brandId = validateRequest(Joi.string().required(), req.params.id);
  const { brand } = await deleteBrand(brandId);
  appAssert(brand, NotFound, "Brand not found", NOT_FOUND);
  return res.status(OK).json({ brand: brand, message: "Brand removed" });
});
export const deleteBrandHandlerSSR = catchErrors(async (req, res) => {
  const brandId = validateRequest(Joi.string().required(), req.params.id);
  try {
    const { brand } = await deleteBrand(brandId);
    if (!brand) {
      res.status(NOT_FOUND).render("404", {
        isLoggedIn: !!req.cookies.accessToken,
        // user: req.session.user
      });
    }
  } catch (err: any) {
    res.render("404", {
      isLoggedIn: !!req.cookies.accessToken,
      // user: req.session.user
    });
  }
});
