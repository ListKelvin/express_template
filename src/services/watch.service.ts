import AppErrorCodes from "../constant/appErrorCodes";
import appAssert from "../utils/appAssert";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNPROCESSABLE_CONTENT,
} from "../constant/http";
import WatchModel, { Watch } from "../models/watch.model";
import BrandModel from "../models/brand.model";

const { ValidateFailed, Unknown, NotFound } = AppErrorCodes;
export const createWatch = async (
  data: Pick<
    Watch,
    | "watchName"
    | "image"
    | "brandId"
    | "price"
    | "automatic"
    | "watchDescription"
  >
) => {
  const existBrand = await BrandModel.exists({ brandName: data.brandId });

  appAssert(!existBrand, ValidateFailed, "Brand not exist", CONFLICT);

  const watch = await WatchModel.create({
    ...data,
  });

  return { watch: watch };
};

// update Players cần chỉnh sửa khi update nation của một player phải check player list của nation và xóa nó . cập nhật player list của nation ms
export const updateWatch = async (
  id: Watch["_id"],
  data: Pick<
    Watch,
    | "watchName"
    | "image"
    | "brandId"
    | "price"
    | "automatic"
    | "watchDescription"
  >
) => {
  const existBrand = await BrandModel.exists({ _id: data.brandId });

  appAssert(existBrand, ValidateFailed, "Brand not exist", CONFLICT);

  const watchId = await WatchModel.findById(id);
  appAssert(watchId, NotFound, "Watch is not found", NOT_FOUND);

  const updateWatch = await WatchModel.findByIdAndUpdate(watchId.id, data, {
    new: true,
  });
  appAssert(
    updateWatch,
    Unknown,
    "Failed to update Watch",
    INTERNAL_SERVER_ERROR
  );

  return { watch: updateWatch };
};

export const getAllWatch = async (filters = {}, searchTerm = "") => {
  // Build the query object dynamically based on filters and searchTerm
  let query = {};

  // Filter by brandId (exact match)
  if (filters.brandId) {
    query.brandId = filters.brandId;
  }

  // Search by watchName (case-insensitive, full-text search using regex)
  if (searchTerm) {
    const searchRegex = new RegExp(searchTerm, "i"); // Case-insensitive
    query.$text = { $search: searchTerm }; // Full-text search
  }

  // Project desired fields
  const projection = "watchName image brandId";

  try {
    const watchs = await WatchModel.find(query, projection);
    return { watchs };
  } catch (error) {
    console.error("Error fetching watches:", error);
    return { watchs: [], error }; // Handle errors gracefully
  }

  // const listAll = await WatchModel.find().select("watchName image brandId");
  // return { watchs: listAll };
};

export const getWatchById = async (id: Watch["_id"]) => {
  const watch = await WatchModel.findById(id);
  return { watch: watch };
};

export const deleteWatch = async (id: Watch["_id"]) => {
  const watch = await WatchModel.findByIdAndDelete(id);
  appAssert(watch, NotFound, "Watch is not found", NOT_FOUND);
  return { watch };
};
