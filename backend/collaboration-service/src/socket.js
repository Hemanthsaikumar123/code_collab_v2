function initializeSocket(io) {
  const roomCodeMap = new Map();
  const roomUsers = new Map();
  const roomLanguageMap = new Map();
  const roomOutputMap = new Map();
  const roomMessagesMap = new Map();
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

        const language =roomLanguageMap.get(roomId)|| "javascript";
        socket.emit("initial-language",language);

        const output = roomOutputMap.get(roomId)|| "";
        socket.emit("initial-output",output);

        const messages = roomMessagesMap.get(roomId) || [];
        socket.emit("initial-messages",messages);
        });

        
    socket.on("language-change",({ roomId, language }) => {
            roomLanguageMap.set(
              roomId,
              language
            );

            socket.to(roomId).emit("language-update",language);

          }
        );

    socket.on("code-change",({ roomId, code }) => {

            roomCodeMap.set(roomId,code);

            socket.to(roomId).emit("code-update",code);
          }
        );
    
    socket.on("output-change",({ roomId, output }) => {

          roomOutputMap.set(
            roomId,
            output
          );

          io.to(roomId).emit("output-update",output);
        }
      );

    socket.on("send-message",({roomId,username,message}) => {

      if (!roomMessagesMap.has(roomId)) {
        roomMessagesMap.set(roomId,[]);
      }
      const messages = roomMessagesMap.get(roomId);
      const chatMessage = {
        username,
        message,
        timestamp:
          Date.now()

      };

      messages.push(chatMessage);

      io.to(roomId).emit("message-received",chatMessage);

    });
    
    socket.on("disconnect",() => {

          for (const [roomId, users]of roomUsers.entries()) {

            const leavingUser = users.find(user =>user.socketId === socket.id);
            const updatedUsers = users.filter(user =>user.socketId !== socket.id);

            roomUsers.set(
              roomId,updatedUsers
            );

            io.to(roomId).emit(
              "participants-update",updatedUsers
            );

            if (leavingUser) {
              const leaveMessage = {
                username: "System",
                message:`${leavingUser.username} left the room`,
                timestamp:Date.now()
              };

              if(!roomMessagesMap.has(roomId)) {
                roomMessagesMap.set(roomId,[]);
              }
              roomMessagesMap
                .get(roomId)
                .push(
                  leaveMessage
                );

              io.to(roomId).emit("message-received",leaveMessage);

            }
          }
        }
        );
      });

}

module.exports = initializeSocket;