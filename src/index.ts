// import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/db";
import errorHandler from "./middleware/errorHandler";
import authenticate from "./middleware/authenticate";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import sessionRoutes from "./routes/session.route";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constant/env";
import { buildSchema } from "graphql";
import { createHandler } from "graphql-http";
import { getAllUser } from "./services/user.service";
// initialize modules and middleware

const app = express();
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type User {
    email: string
  }

  type Query {
    users: [User]
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  users() {
    return getAllUser().user;
  },
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    // origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
);
// // auth routes
// app.use("/auth", authRoutes);

// // protected routes
app.use("/user", userRoutes);
// app.use("/sessions", authenticate, sessionRoutes);

// error handler
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT} in ${NODE_ENV} environment`);
  await connectToDatabase();
});
