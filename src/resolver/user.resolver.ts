import { getAllUser } from "./../services/user.service";

const userResolvers = {
  getUsers: () => getAllUser().user,
};
export { userResolvers };
