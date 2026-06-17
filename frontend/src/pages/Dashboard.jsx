import { useState } from "react";
import {createRoom,joinRoom} from "../services/roomApi";
import { useNavigate } from "react-router-dom";


function Dashboard() {
const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");

  const handleCreateRoom =async () => {
      try {
        const response = await createRoom();
        navigate(`/room/${response.data.id}`);
        // alert(`Room Created: ${response.data.room_code}`);
      } 
      catch (error) {
        alert(error.response?.data?.message);
      }
    };

  const handleJoinRoom = async () => {
      try {
        const response = await joinRoom(roomCode);
        navigate(`/room/${response.data.id}`);
        // alert( `Joined Room: ${response.data.room_code}`);
      } 
      catch (error) {
        alert(error.response?.data?.message);
      }
    };

  return (
    <div>
      <h1>Dashboard</h1>
      <button
        onClick={handleCreateRoom}
      >
        Create Room
      </button>

      <hr />

      <input
        placeholder="Room Code"
        value={roomCode}
        onChange={(e)=>
          setRoomCode(
            e.target.value
          )
        }
      />

      <button
        onClick={handleJoinRoom}
      >
        Join Room
      </button>

    </div>
  );
}

export default Dashboard;