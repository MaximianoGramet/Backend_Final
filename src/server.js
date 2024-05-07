// Importaciones necesarias
import expressApp from "./config/server/express.config.js";
import httpServer from "./config/server/http.config.js";
import io from "./config/server/socket.config.js";
import ProductRouter from "./routes/products.routes.js";
import CartRouter from "./routes/carts.routes.js";
import ViewsRouter from "./routes/views.routes.js";
import UserViewsRouter from "./routes/users.views.routes.js";
import SessionRouter from "./routes/session.routes.js";
import githubLoginRouter from "./routes/github-login.views.routes.js";
import Mockrouter from "./routes/mock.routes.js";
import swaggerUiExpress from "swagger-ui-express";
import express from "express";
import mongoose from "mongoose";
import swaggerJSDoc from "swagger-jsdoc";
import UsersRouter from "./routes/users.routes.js";

import { __dirname } from "./utils/utils.js";
import config from "../src/config/config.js";

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "documentación Coderhouse",
      description: "API para la entrega de swagger",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};
const specs = swaggerJSDoc(swaggerOptions);

const Host = express();

const SERVER_PORT = config.port;
const MONGO_URL = config.urlMongo;

expressApp.use("/api/products", ProductRouter);
expressApp.use("/api/carts", CartRouter);
expressApp.use("/", ViewsRouter);
expressApp.use("/", Mockrouter);
expressApp.use("/api/sessions", SessionRouter);
expressApp.use("/users", UserViewsRouter);
expressApp.use("/github", githubLoginRouter);
expressApp.use("/api/users", UsersRouter);
expressApp.use(
  "/apidocs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(specs)
);

httpServer;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connection established");
  })
  .catch((error) => {
    console.error("Connection failed", error);
  });

io;

export { Host, httpServer, specs };
