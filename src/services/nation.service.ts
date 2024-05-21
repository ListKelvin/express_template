import NationModel, { Nation } from "../models/nation.model";
import AppErrorCodes from "../constant/appErrorCodes";
import appAssert from "../utils/appAssert";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNPROCESSABLE_CONTENT,
} from "../constant/http";

const { ValidateFailed, Unknown, NotFound } = AppErrorCodes;
export const createNation = async (data: Pick<Nation, "name" | "imageUrl">) => {
  const existNation = await NationModel.exists({
    name: data.name,
  });

  appAssert(!existNation, ValidateFailed, "Nation exist", CONFLICT);

  const nation = await NationModel.create({
    name: data.name,
    imageUrl: data.imageUrl,
  });

  return { nation: nation };
};

export const updateNational = async (
  id: Nation["_id"],
  data: Pick<Nation, "name" | "imageUrl">
) => {
  const nationId = await NationModel.findById(id);
  appAssert(nationId, NotFound, "Nation is not found", NOT_FOUND);

  const updateNation = await NationModel.findByIdAndUpdate(nationId.id, data, {
    new: true,
  });
  appAssert(
    updateNation,
    Unknown,
    "Failed to update user",
    INTERNAL_SERVER_ERROR
  );
  return { nation: updateNation };
};

export const getAllNation = async () => {
  const listAll = await NationModel.find();
  return { nations: listAll };
};

export const getNationById = async (id: Nation["_id"]) => {
  const nation = await NationModel.findById(id);
  return { nation: nation };
};

export const deleteNation = async (id: Nation["_id"]) => {
  const nation = await NationModel.findByIdAndDelete(id);
  appAssert(nation, NotFound, "Nation is not found", NOT_FOUND);
  return { nation };
};
