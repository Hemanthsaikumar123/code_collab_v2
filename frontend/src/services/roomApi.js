import api from "./api";

export const createRoom = async () => {
  const response = await api.post(
    "/api/rooms"
  );

  return response.data;
};

export const joinRoom = async (roomCode) => {
  const response = await api.post(
    "/api/rooms/join",
    { roomCode }
  );

  return response.data;
};


export const getRoom = async (roomId) => {
  const response = await api.get(
    `/api/rooms/${roomId}`
  );

  return response.data;
};

export const getMembers = async (roomId) => {
  const response = await api.get(
    `/api/rooms/${roomId}/members`
  );

  return response.data;
};