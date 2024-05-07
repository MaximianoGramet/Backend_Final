import httpServer from "./http.config.js";
import { Server } from "socket.io";
import messageDao from "../../Services/daos/dbManager/message.dao.js";

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("new client connected");

  socket.on("chat message", async (msg) => {
    try {
      await messageDao.createMessage({ user: msg.user, message: msg.content });
    } catch (error) {
      console.log(error);
    }
    io.emit("chat message", msg);
  });
});

export default io;
