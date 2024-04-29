import express from "express";
import connectToDatabase from "./config/db";
import { NODE_ENV, PORT } from "./constant/env";
import userRoutes from "./routes/user.route";
import authenticate from "./middleware/authenticate";
import errorHandler from "./middleware/errorHandler";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/auth", authRoutes);

// protected routes authenticate,
app.use("/user", userRoutes);
// app.use("/sessions", authenticate, sessionRoutes);

// error handler
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT} in ${NODE_ENV} environment`);
  await connectToDatabase();
});
