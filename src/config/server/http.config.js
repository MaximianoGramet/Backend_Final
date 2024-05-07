import expressApp from "./express.config.js";
import mongoose from "mongoose";
import config from "../config.js";

const SERVER_PORT = config.port;
const MONGO_URL = config.urlMongo;

const httpServer = expressApp.listen(SERVER_PORT, () => {
  console.log(`Initiating server at port: ${SERVER_PORT}...`);
});

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connection established");
  })
  .catch((error) => {
    console.error("Connection failed", error);
  });

export default httpServer;
