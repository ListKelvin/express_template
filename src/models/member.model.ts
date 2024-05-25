import mongoose from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";
import Roles from "../constant/roles";

export interface Member extends mongoose.Document {
  memberName: string;
  email: string;
  password: string;
  role: Roles;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  isAdmin: boolean;
  comparePassword(val: string): Promise<boolean>;
  omitPassword(): Pick<
    Member,
    | "_id"
    | "email"
    | "memberName"
    | "verified"
    | "createdAt"
    | "updatedAt"
    | "__v"
  >;
}

const memberSchema = new mongoose.Schema<Member>(
  {
    email: { type: String, required: true, unique: true },
    memberName: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: Roles, default: Roles.MEMBER },
    verified: { type: Boolean, required: true, default: false },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

memberSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await hashValue(this.password);
  return next();
});

memberSchema.methods.comparePassword = async function (val: string) {
  return compareValue(val, this.password);
};

memberSchema.methods.omitPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const MemberModal = mongoose.model<Member>("Member", memberSchema);
export default MemberModal;
