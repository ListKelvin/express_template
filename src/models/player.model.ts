import mongoose from "mongoose";
import { Nation } from "./nation.model";

export interface Player extends mongoose.Document {
  name: string;
  club: string;
  createdAt: Date;
  updatedAt: Date;
  nationId: Nation["_id"];
}

const playerSchema = new mongoose.Schema<Player>(
  {
    name: { type: String },
    club: { type: String },
    nationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Nation",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const PlayerModel = mongoose.model<Player>("Player", playerSchema);
export default PlayerModel;
