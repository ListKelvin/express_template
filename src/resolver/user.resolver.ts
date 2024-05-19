import { getAllUser } from "./../services/user.service";

const userResolvers = {
  //QUERY
  Query: {
    users: () => getAllUser().user,
  },
};
export { userResolvers };
