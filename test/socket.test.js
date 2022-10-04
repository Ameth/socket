const { createServer } = require("http");
const { hasUncaughtExceptionCaptureCallback } = require("process");
const { Server } = require("socket.io");
const Client = require("socket.io-client");

describe("Testing Socket.io", () => {
  let io;
  let serverSocket;
  let clientSocket;

  // Antes de empezar a realizar los test, creamos el servidor
  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);

    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);

      io.on("connection", (socket) => {
        serverSocket = socket;
      });

      clientSocket.on("connect", done);
    });
  });

  // Despues de ejecutarse todos los test
  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test("Testear conexión inicial", (done) => {
    clientSocket.on("saludar", (msg) => {
      try {
        expect(msg).toBe("Bienvenido!");
        done();
      } catch (error) {
        done(error);
      }
    });

    serverSocket.emit("saludar", "Bienvenido!");
  });

  test("Testeando callbacks", (done) => {
    serverSocket.on("llamada", (callback) => {
      callback("Lucky!");
    });

    clientSocket.emit("llamada", (text) => {
      try {
        expect(text).toBe("Lucky!");
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
