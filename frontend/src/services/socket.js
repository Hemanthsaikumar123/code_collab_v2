import { io }
from "socket.io-client";

const socket =
  io(
    "http://localhost:5004"
  );

export default socket;