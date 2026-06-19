function initializeSocket(io) {
  const roomCodeMap = new Map();
  const roomUsers = new Map();
  io.on("connection", (socket) => {

    console.log(`User connected ${socket.id}`);

    socket.on("join-room",({roomId,userId,username}) => {
    socket.join(roomId);

    const existingCode =roomCodeMap.get(roomId) || "";

    socket.emit("initial-code",existingCode);

    if (!roomUsers.has(roomId)) {
      roomUsers.set(roomId, []);
    }

    const users = roomUsers.get(roomId);

    const alreadyExists =users.some(user =>
          user.socketId === socket.id
      );

    if (!alreadyExists) {
      users.push({
        socketId: socket.id,
        userId,
        username
      });
    }

      io.to(roomId).emit("participants-update",users);
    });

    socket.on("code-change",({ roomId, code }) => {

        roomCodeMap.set(roomId,code);

        socket.to(roomId).emit("code-update",code);
      }
    );

    socket.on("disconnect",() => {

        for (const [roomId, users]of roomUsers.entries()) {
          const updatedUsers = users.filter(user =>user.socketId !==socket.id);

          roomUsers.set(
            roomId,updatedUsers
          );

          io.to(roomId).emit(
            "participants-update",updatedUsers
          );
        }
      }
    );
  });

}

module.exports = initializeSocket;