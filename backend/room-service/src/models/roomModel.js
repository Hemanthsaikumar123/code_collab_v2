const pool = require("../config/db");

const createRoom = async ({ id, roomCode, ownerId }) => {
  const result = await pool.query(
    `
    INSERT INTO rooms
    (id, room_code, owner_id)
    VALUES ($1,$2,$3)
    RETURNING *
    `,
    [id, roomCode, ownerId]
  );

  return result.rows[0];
};


const findByCode = async ( roomCode ) => {
  const result = await pool.query(
    `
    SELECT *
    FROM rooms
    WHERE room_code=$1
    `,
    [roomCode]
  );

  return result.rows[0];
};


const findById = async ( roomId ) => {
  const result = await pool.query(
    `
    SELECT *
    FROM rooms
    WHERE id=$1
    `,
    [roomId]
  );

  return result.rows[0];
};


const addMember = async ( roomId, userId ) => {

  await pool.query(
    `
    INSERT INTO room_members
    (room_id,user_id)
    VALUES ($1,$2)
    ON CONFLICT DO NOTHING
    `,
    [roomId,userId]
  );
};


const getMembers = async ( roomId ) => {

  const result = await pool.query(
    `
    SELECT user_id
    FROM room_members
    WHERE room_id=$1
    `,
    [roomId]
  );

  return result.rows;
};

module.exports = {
  createRoom,
  findByCode,
  findById,
  addMember,
  getMembers
};