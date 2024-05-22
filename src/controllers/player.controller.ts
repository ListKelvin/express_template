import Joi from "joi";
import { NOT_FOUND, OK } from "../constant/http";
import { updateNational } from "../services/nation.service";
import catchErrors from "../utils/catchErrors";
import validateRequest from "../utils/validateRequest";
import appAssert from "../utils/appAssert";
import AppErrorCodes from "../constant/appErrorCodes";
import {
  createPlayerSchema,
  updatePlayerSchema,
} from "../schema/player.schemas";
import {
  createPlayer,
  deletePlayer,
  getAllPlayer,
  getPlayerById,
  updatePlayer,
} from "../services/player.service";
const { NotFound } = AppErrorCodes;
export const createPlayerHandler = catchErrors(async (req, res) => {
  const request = validateRequest(createPlayerSchema, {
    ...req.body,
  });
  console.log(request);

  const { player } = await createPlayer(request);

  return res.status(OK).json(player);
});

// chưa check chùng tên nation
export const updatePlayerHandler = catchErrors(async (req, res) => {
  const request = validateRequest(updatePlayerSchema, {
    ...req.body,
  });

  const { player } = await updatePlayer(req.params.id, request);
  return res.status(OK).json(player);
});

export const getAllPlayerHandler = catchErrors(async (req, res) => {
  const { players } = await getAllPlayer();
  return res.status(OK).json(players);
});
export const getPlayerByIdHandler = catchErrors(async (req, res) => {
  const playerId = validateRequest(Joi.string().required(), req.params.id);
  const { player } = await getPlayerById(playerId);
  appAssert(player, NotFound, "Player not found", NOT_FOUND);
  return res.status(OK).json(player);
});
export const deletePlayerHandler = catchErrors(async (req, res) => {
  const playerId = validateRequest(Joi.string().required(), req.params.id);
  const { player } = await deletePlayer(playerId);
  appAssert(player, NotFound, "Nation not found", NOT_FOUND);
  return res.status(OK).json({ player: player, message: "Nation removed" });
});
