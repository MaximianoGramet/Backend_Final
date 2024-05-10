// Importaciones necesarias
import httpServer from "./config/server/http.config.js";
import io from "./config/server/socket.config.js";

import mongoose from "mongoose";
import { __dirname } from "./utils/utils.js";
import config from "../src/config/config.js";

const MONGO_URL = config.urlMongo;

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

export { httpServer };
