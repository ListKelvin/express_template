import NationModel, { Nation } from "../models/nation.model";
import AppErrorCodes from "../constant/appErrorCodes";
import appAssert from "../utils/appAssert";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNPROCESSABLE_CONTENT,
} from "../constant/http";
import PlayerModel, { Player } from "../models/player.model";

const { ValidateFailed, Unknown, NotFound } = AppErrorCodes;
export const createPlayer = async (
  data: Pick<Player, "name" | "club" | "nationId">
) => {
  const existNation = await NationModel.findById(data.nationId);

  appAssert(existNation, ValidateFailed, "Nation not exist", CONFLICT);

  const player = await PlayerModel.create({
    name: data.name,
    club: data.club,
    nationId: data.nationId,
  });
  await NationModel.findByIdAndUpdate(data.nationId, {
    players: [...existNation.players, player],
  });
  return { player: player };
};

// update Players cần chỉnh sửa khi update nation của một player phải check player list của nation và xóa nó . cập nhật player list của nation ms
export const updatePlayer = async (
  id: Player["_id"],
  data: Pick<Player, "name" | "nationId" | "club">
) => {
  const nationId = await NationModel.findById(data.nationId);
  appAssert(nationId, NotFound, "Nation is not found", NOT_FOUND);
  const playerId = await PlayerModel.findById(id);
  appAssert(playerId, NotFound, "Player is not found", NOT_FOUND);

  const updatePlayer = await PlayerModel.findByIdAndUpdate(playerId.id, data, {
    new: true,
  });
  appAssert(
    updatePlayer,
    Unknown,
    "Failed to update user",
    INTERNAL_SERVER_ERROR
  );

  return { player: updatePlayer };
};

export const getAllPlayer = async () => {
  const listAll = await PlayerModel.find();
  return { players: listAll };
};

export const getPlayerById = async (id: Player["_id"]) => {
  const player = await PlayerModel.findById(id);
  return { player: player };
};

export const deletePlayer = async (id: Player["_id"]) => {
  const player = await PlayerModel.findByIdAndDelete(id);
  appAssert(player, NotFound, "Nation is not found", NOT_FOUND);
  return { player };
};
