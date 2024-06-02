import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { PostService } from "./component/post";
import {
  PostController,
  postControllerRouter,
} from "./component/post/controller";
import {
  UserController,
  UserControllerRouter,
} from "./component/user/controller";
import { userService } from "./component/user/index";

import cors, { CorsOptions } from "cors";
import {
  CityController,
  cityControllerRouter,
} from "./component/city/controller";
import { cityService } from "./component/city/index";
import {
  SessionController,
  SessionControllerRouter,
} from "./component/session/controller";
import { sessionService } from "./component/session/index";

const allowedOrigins = "http://localhost:5173/";

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"], // Autoriser uniquement les méthodes nécessaires
  allowedHeaders: ["Content-Type", "Authorization"], // Autoriser uniquement les en-têtes nécessaires
  credentials: true, // Autoriser les cookies si nécessaire
  optionsSuccessStatus: 200, // Pour certains navigateurs (legacy browsers)
};

dotenv.config();
const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

new CityController(cityService);
new UserController(userService);
new PostController(PostService, cityService);
new SessionController(sessionService);
const PORT = process.env.PORT;
/* cityService.createCities(); */
app.use("/api/v1", UserControllerRouter);
app.use("/api/v1", postControllerRouter);
app.use("/api/v1", cityControllerRouter);
app.use("/api/v1", SessionControllerRouter);
app.listen(PORT, () => {
  console.log(`écoute sur le port ${PORT}`);
});
