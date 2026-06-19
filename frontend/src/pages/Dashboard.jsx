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
    <div className="auth-page">
      <div className="terminal-window auth-card">
        <div className="terminal-header">
          <div className="terminal-dots">
            <span className="dot dot-red"></span>
            <span className="dot dot-amber"></span>
            <span className="dot dot-green"></span>
          </div>
          <span className="terminal-path">~/dashboard</span>
        </div>

        <div className="terminal-body">
          <h1 className="auth-title">
            <span className="prompt">&gt;</span> Dashboard
          </h1>

          <button
            className="btn btn-primary btn-block"
            style={{ marginTop: 24 }}
            onClick={handleCreateRoom}
          >
            Create Room
          </button>

          <div className="divider"><span>or join existing</span></div>

          <div className="join-row">
            <input
              className="input"
              placeholder="Room Code"
              value={roomCode}
              onChange={(e)=>
                setRoomCode(
                  e.target.value
                )
              }
            />

            <button
              className="btn btn-secondary"
              onClick={handleJoinRoom}
            >
              Join
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;