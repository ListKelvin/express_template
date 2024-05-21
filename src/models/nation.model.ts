import mongoose from "mongoose";
import { Player } from "./player.model";

export interface Nation extends mongoose.Document {
  name: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  players: Array<Player>;
}

const nationSchema = new mongoose.Schema<Nation>(
  {
    name: { type: String, required: true, unique: true },
    imageUrl: { type: String },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
  },
  {
    timestamps: true,
  }
);
const NationModel = mongoose.model<Nation>("Nation", nationSchema);
export default NationModel;
