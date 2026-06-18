import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import CodeEditor from "../components/CodeEditor";
import { runCode } from "../services/runnerApi";
import { getRoom,getMembers } from "../services/roomApi";

function Room() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [members, setMembers] = useState([]);
  const [language,setLanguage] = useState("javascript");
  const [code,setCode] = useState(`console.log("Hello World");`);
  const [output,setOutput] = useState("");

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

  const handleRun = async () => {
    try {
      const response = await runCode(language, code);
      setOutput(response.output);
    } 
    catch (error) {
      setOutput(error.response?.data?.message);
    }
  };

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
      <hr />

    <select
    value={language}
    onChange={(e) =>
        setLanguage(
        e.target.value)}
    >

    <option value="javascript">
        JavaScript
    </option>

    <option value="python">
        Python
    </option>

    <option value="cpp">
        C++
    </option>

    <option value="java">
        Java
    </option>

    </select>

    <button onClick={handleRun}>
    Run
    </button>

    <CodeEditor
    language={language}
    code={code}
    setCode={setCode}
    />

    <h3>Output</h3>

    <pre>{output}</pre>
    </div>

  );
}

export default Room;