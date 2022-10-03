const express = require("express");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static(path.join(__dirname, "views")));

const socketsOnLine = [];

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

  socketsOnLine.push(socket.id);

  // Emisión básica de eventos

  socket.emit("bienvenido", "Ahora estás conectado 😎");

  socket.on("cliente", (data) => {
    console.log(data);
    io.emit("todos", data);
  });

  // Emisión a todos los clientes
  io.emit("todos", socket.id + " se ha conectado");

  // Emisión a uno solo
  socket.on("saludar_last", (data) => {
    const lastSocket = socketsOnLine.at(-1);
    io.to(lastSocket).emit("saludo", data);
  });

  // on -> se emite varias veces y se escucha todas las veces
  //   socket.emit("on", "Hola a On");
  //   socket.emit("on", "Hola a On");

  // once -> se emite varias veces, pero se escucha una sola vez
  //   socket.emit("once", "Hola a Once");
  //   socket.emit("once", "Hola a Once");

  // off -> se emite el evento, pero se deja de escuchar en el cliente
  //   socket.emit("apagar", "Hola desde Off");

  //   setTimeout(() => {
  //     socket.emit("apagar", "Hola desde Off");
  //   }, 3000);

  socket.on("circle_position", (position) => {
    // io.emit -> emite el evento a todos los clientes, incluso al que lo llamó originalmente
    // io.emit("circle_move", position);

    // socket.broadcast.emit -> emite el evento a todos los clientes, menos al cliente que lo llamo
    socket.broadcast.emit("circle_move", position);
  });
});

/*
    On → Se usa para detectar (o escuchar) un evento varias veces.
    Once → Se usa para detectar (o escuchar) un evento una sola vez. Sin importar si el evento se emite varias veces.
    Off → Se usa para dejar de escuchar un evento, sin importar que este se siga emitiendo. 
*/

httpServer.listen(3000);
