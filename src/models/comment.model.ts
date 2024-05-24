import mongoose from "mongoose";
import { Member } from "./member.model";

export interface Comment extends mongoose.Document {
  rating: number;
  content: string;
  author: Member["_id"];
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new mongoose.Schema<Comment>(
  {
    rating: { type: Number, min: 1, max: 3, require: true },
    content: { type: String, require: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      require: true,
    },
  },
  {
    timestamps: true,
  }
);
const CommentModel = mongoose.model<Comment>("Comment", commentSchema);
export default CommentModel;
