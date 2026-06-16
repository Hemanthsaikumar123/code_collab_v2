const roomService = require('../services/roomService');

const createRoom = async ( req, res ) => {
  try {
    const room = await roomService.createRoom( req.user.id );
    res.status(201).json({
      success:true,
      data:room
    });

  } catch(error) {
    res.status(400).json({
      success:false,
      message:error.message
    });
  }
};

const joinRoom = async ( req, res ) => {
  try {
    const room = await roomService.joinRoom({
        roomCode:req.body.roomCode,
        userId:req.user.id
      });

    res.json({
      success:true,
      data:room
    });

  } catch(error) {
    res.status(404).json({
      success:false,
      message:error.message
    });

  }
};


const getRoom = async (req, res) => {
  try {
    const room = await roomService.getRoom( req.params.id);
    return res.json({
      success: true,
      data: room
    });

  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};


const getRoomMembers = async ( req, res ) => {
  try {
    const members = await roomService.getRoomMembers( req.params.id );
    return res.json({
      success: true,
      data: members
    });

  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createRoom,
  joinRoom,
  getRoom,
  getRoomMembers
};
