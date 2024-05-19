import UserModel from "../models/user.model";

export const getAllUser = () => {
  const user = UserModel.find();

  return { user: user };
};
