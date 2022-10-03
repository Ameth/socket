const express = require("express");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static(path.join(__dirname, "views")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/view/index.html");
});

io.on("connection", (socket) => {
  //   console.log("Clientes conectados:", io.engine.clientsCount);
  //   console.log("ID del socket conectado:", socket.id);
  //   socket.on("disconnect", () => {
  //     console.log(`Se desconecto el socket ${socket.id}`);
  //   });
  //   socket.conn.once("upgrade", () => {
  //     console.log(
  //       "Hemos pasado de HTTP Long-Polling a " + socket.conn.transport.name
  //     );
  //   });
});

httpServer.listen(3000);
