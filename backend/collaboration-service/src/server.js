const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const initializeSocket = require("./socket");

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

initializeSocket(io);

server.listen(5004,() => {
    console.log("Collaboration Service running on 5004");
  }
);