import mongoose from "mongoose";

import { Brand } from "./brand.model";
import CommentModel from "./comment.model";

export interface Watch extends mongoose.Document {
  watchName: string;
  image: string;
  price: number;
  automatic: boolean;
  watchDescription: string;
  comments: Array<Comment>;
  brandId: Brand["_id"];
  createdAt: Date;
  updatedAt: Date;
}

const watchSchema = new mongoose.Schema<Watch>(
  {
    watchName: { type: String, require: true },
    image: { type: String, require: true },
    price: { type: Number, require: true },
    automatic: { type: Boolean, default: false },
    watchDescription: { type: String, require: true },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const WatchModel = mongoose.model<Watch>("Watch", watchSchema);
export default WatchModel;
