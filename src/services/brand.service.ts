import NationModel, { Nation } from "../models/nation.model";
import AppErrorCodes from "../constant/appErrorCodes";
import appAssert from "../utils/appAssert";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNPROCESSABLE_CONTENT,
} from "../constant/http";

import BrandModel, { Brand } from "../models/brand.model";

const { ValidateFailed, Unknown, NotFound } = AppErrorCodes;
export const createBrand = async (data: Pick<Brand, "brandName">) => {
  const existBrand = await BrandModel.exists({
    brandName: data.brandName,
  });

  appAssert(!existBrand, ValidateFailed, "Brand exist", CONFLICT);

  const brand = await BrandModel.create({
    brandName: data.brandName,
  });

  return { brand: brand };
};

export const updateBrand = async (
  id: Brand["_id"],
  data: Pick<Brand, "brandName">
) => {
  const brandId = await BrandModel.findById(id);
  appAssert(brandId, NotFound, "brand is not found", NOT_FOUND);

  const updateBrand = await BrandModel.findByIdAndUpdate(brandId.id, data, {
    new: true,
  });
  appAssert(
    updateBrand,
    Unknown,
    "Failed to update brand",
    INTERNAL_SERVER_ERROR
  );
  return { brand: updateBrand };
};

export const getAllBrand = async () => {
  const listAll = await BrandModel.find();
  return { brands: listAll };
};

export const getBrandById = async (id: Brand["_id"]) => {
  const brand = await BrandModel.findById(id);
  return { brand: brand };
};

export const deleteBrand = async (id: Brand["_id"]) => {
  const brand = await BrandModel.findByIdAndDelete(id);
  appAssert(brand, NotFound, "Brand is not found", NOT_FOUND);
  return { brand };
};
