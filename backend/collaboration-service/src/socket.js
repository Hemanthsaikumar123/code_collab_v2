function initializeSocket(io) {
  const roomCodeMap = new Map();
  io.on("connection", (socket) => {

    console.log(`User connected ${socket.id}`);

    socket.on("join-room", (roomId) => {

        socket.join(roomId);
        const existingCode = roomCodeMap.get(roomId) || "";
        socket.emit("initial-code",existingCode);
      }
    );

    socket.on("code-change",({ roomId, code }) => {

        roomCodeMap.set(roomId,code);

        socket.to(roomId).emit("code-update",code);
      }
    );

    socket.on("disconnect",() => {

        console.log(`${socket.id} disconnected`);
      }
    );
  });

}

module.exports = initializeSocket;