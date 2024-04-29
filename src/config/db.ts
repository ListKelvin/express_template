import mongoose from "mongoose";
import { MONGO_URI } from "../constant/env";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://phamm5687:ccxqxhi6Fo9pWlug@mongodb.xqo6hjj.mongodb.net/?retryWrites=true&w=majority&appName=MongoDB"
    );
    console.log("Successfully connected to DB");
  } catch (error) {
    console.error("Could not connect to DB", error);
    process.exit(1);
  }
};
export default connectToDatabase;
