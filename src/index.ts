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
import path from "path";
import { engine } from "express-handlebars";
import moment from "moment";
// initialize modules and middleware

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname + "/public")));

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

app.set("view engine", "hbs");
app.set("views", path.join(__dirname + "/views"));
app.engine(
  "hbs",
  engine({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {
      inc: function (value: any, options: any) {
        return parseInt(value) + 1;
      },
      prettifyDate: function (timestamp: any) {
        return moment(timestamp, "YYYY-MM-DDTHH:mm:ss.SSS").format(
          "YYYY-MM-DD HH:mm"
        );
      },
      commentDate: function (timestamp: any) {
        console.log(timestamp, moment(timestamp).format("MMM. Do YYYY HH:MM"));
        return moment(timestamp, "YYYY-MM-DDTHH:mm:ss.SSS").format(
          "MMM. Do YYYY HH:mm"
        );
      },
      ifEquals: function (arg1: any, arg2: any, options: any) {
        return arg1 == arg2 ? options.fn(this) : options.inverse(this);
      },
    },
  })
);
app.get("/", (req, res) => {
  res.render("home");
});

// error handler
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT} in ${NODE_ENV} environment`);
  await connectToDatabase();
});
