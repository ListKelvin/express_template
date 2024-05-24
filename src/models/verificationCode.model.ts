import mongoose from "mongoose";
import { User } from "./user.model";
import VerificationCodeTypes from "../constant/verificationCodeTypes";
import { Member } from "./member.model";

export interface VerificationCodeDocument extends mongoose.Document {
  memberId: Member["_id"];
  type: VerificationCodeTypes;
  expiresAt: Date;
  createdAt: Date;
}

const verificationCodeSchema = new mongoose.Schema<VerificationCodeDocument>({
  memberId: {
    ref: "Member",
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

const VerificationCodeModel = mongoose.model<VerificationCodeDocument>(
  "VerificationCode",
  verificationCodeSchema,
  "verification_codes"
);
export default VerificationCodeModel;
