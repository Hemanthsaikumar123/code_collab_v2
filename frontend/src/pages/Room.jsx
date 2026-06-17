import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getRoom,getMembers } from "../services/roomApi";

function Room() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {

    const fetchRoomData = async () => {
        try {
          const roomResponse = await getRoom(roomId);
          const membersResponse = await getMembers(roomId);

          setRoom(roomResponse.data);
          setMembers(membersResponse.data);
        } 
        catch (error) {
          console.error(error);
        }
      };
    fetchRoomData();
  }, [roomId]);

  if (!room) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <h1>Room</h1>

      <p> Room Code:{" "}{room.room_code} </p>

      <h3>Members</h3>

      <ul>
        {members.map((member) => (
          <li key={member.user_id}>
            {member.user_id}
          </li>
        ))}
      </ul>

    </div>
  );
}

export default Room;