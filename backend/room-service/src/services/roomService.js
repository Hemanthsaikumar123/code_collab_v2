const { v4: uuidv4 } = require("uuid");
const roomModel = require("../models/roomModel");
const generateRoomCode = require("../utils/generateRoomCode");

const createRoom = async ( ownerId ) => {
  const roomCode = generateRoomCode();
  const room = await roomModel.createRoom({ id: uuidv4(), roomCode, ownerId });
  await roomModel.addMember( room.id, ownerId );
  return room;
};


const joinRoom = async ({ roomCode, userId }) => {
  const room = await roomModel.findByCode( roomCode );

  if (!room) {
    throw new Error(
      "Room not found"
    );
  }
  await roomModel.addMember( room.id, userId );
  return room;
};


const getRoom = async ( roomId ) => {
  const room = await roomModel.findById( roomId );

  if (!room) {
    throw new Error(
      "Room not found"
    );
  }
  return room;
};


const getRoomMembers = async ( roomId ) => {
  const room = await roomModel.findById( roomId );

  if (!room) {
    throw new Error(
      "Room not found"
    );
  }
  return await roomModel.getMembers(roomId);
};



module.exports = {
  createRoom,
  joinRoom,
  getRoom,
  getRoomMembers
};