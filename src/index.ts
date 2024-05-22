// import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/db";
import errorHandler from "./middleware/errorHandler";
import authenticate from "./middleware/authenticate";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import nationRoutes from "./routes/nation.route";
import sessionRoutes from "./routes/session.route";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constant/env";
import playerRoutes from "./routes/player.route";

// initialize modules and middleware

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    // origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

// // auth routes
app.use("/auth", authRoutes);

// // protected routes
app.use("/user", authenticate, userRoutes);
app.use("/nation", nationRoutes);
app.use("/player", playerRoutes);
app.use("/sessions", authenticate, sessionRoutes);

// error handler
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT} in ${NODE_ENV} environment`);
  await connectToDatabase();
});
