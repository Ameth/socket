const socket = io();

// function checkSocketStatus() {
//   console.log("Estado del socket:", socket.connected);
// }

// socket.on("connect", () => {
//   console.log("El socket se ha conectado:", socket.id);
//   checkSocketStatus();
// });

// socket.on("disconnect", () => {
//   console.log("El socket se ha desconectado:", socket.id);
//   checkSocketStatus();
// });

// socket.on("connect_error", () => {
//   console.log("No se pudo conectar.");
// });

// socket.io.on("reconnect_attempt", () => {
//   console.log("Intentando reconectar...");
// });

// socket.io.on("reconnect", () => {
//   console.log("¡Reconexión exitosa!");
// });

const text = document.getElementById("text");
const btn = document.getElementById("enviar");
const btnSaludar = document.getElementById("saludar");
const mensaje = document.getElementById("mensaje");
const mensajes = document.getElementById("mensajes");

socket.on("bienvenido", (data) => {
  console.log(data);
  text.innerText = data;
});

socket.on("todos", (data) => {
  mensajes.innerHTML += data + "<br>";
});

socket.on("saludo", (data) => {
  mensajes.innerHTML += data + "<br>";
});

btn.addEventListener("click", () => {
  socket.emit("cliente", mensaje.value);
  mensaje.value = "";
});

btnSaludar.addEventListener("click", () => {
  socket.emit("saludar_last", "Bienvenido al grupo");
});

/*
    On → Se usa para detectar (o escuchar) un evento varias veces.
    Once → Se usa para detectar (o escuchar) un evento una sola vez. Sin importar si el evento se emite varias veces.
    Off → Se usa para dejar de escuchar un evento, sin importar que este se siga emitiendo. 
*/

// socket.on("on", () => {
//   console.log("Se emite varias veces");
// });

// socket.once("once", () => {
//   console.log("Se emite una sola vez");
// });

// const listener = () => {
//   console.log("Se va a apagar el evento");
// };

// socket.on("apagar", listener);

// setTimeout(() => {
//   socket.off("apagar", listener);
// }, 2000);

const circle = document.getElementById("circle");

const dragcircle = (position) => {
  circle.style.top = position.top;
  circle.style.left = position.left;
};

const drag = (e) => {
  //   console.log(e);
  //   const clientX = e.clientX;
  //   const clientY = e.clientY;

  const position = {
    top: e.clientY + "px",
    left: e.clientX + "px",
  };

  dragcircle(position);

  socket.emit("circle_position", position);

  //   circle.style.top = clientY + "px";
  //   circle.style.left = clientX + "px";
};

document.addEventListener("mousedown", (e) => {
  document.addEventListener("mousemove", drag);
});

document.addEventListener("mouseup", (e) => {
  document.removeEventListener("mousemove", drag);
});

socket.on("circle_move", (position) => {
  dragcircle(position);
});
