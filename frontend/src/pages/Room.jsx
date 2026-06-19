import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import CodeEditor from "../components/CodeEditor";
import { runCode } from "../services/runnerApi";
import Editor from "@monaco-editor/react";
import { getRoom,getMembers } from "../services/roomApi";
import socket from "../services/socket";

function Room() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [members, setMembers] = useState([]);
  const [language,setLanguage] = useState("javascript");
  const [code,setCode] = useState(`console.log("Hello World");`);
  const [output,setOutput] = useState("");
  const [participants,setParticipants] = useState([]);
  const [messages,setMessages] = useState([]);
  const [message,setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    socket.emit("join-room",
    {
      roomId,
      userId: user.id,
      username: user.username
    });
    }, [roomId]);

  useEffect(() => {
    socket.on("initial-language",(language) => {
        setLanguage(language);
      }
    );
    return () => {
      socket.off("initial-language");
    };
  }, []);


  useEffect(() => {
    socket.on("language-update",(language) => {
        setLanguage(language);
      }
    );
    return () => {
      socket.off("language-update");
    };
  }, []);


  useEffect(() => {
  socket.on("code-update",(newCode) => {
      setCode(newCode);
    }
  );
  return () => {
    socket.off("code-update");
  };
  }, []);


  useEffect(() => {
    socket.on("initial-code",(code) => {
      setCode(code);
      }
    );

    return () => {
      socket.off("initial-code");
    };
    }, []);

  useEffect(() => {
    socket.on("participants-update",(users) => {
        setParticipants(users);
        }
      );
      return () => {
        socket.off("participants-update");
      };
    }, []);

  useEffect(() => {
    socket.on("output-update",output => {
          setOutput(output);
        }
      );
      return () => {
        socket.off("output-update");
      };
    }, []);

  useEffect(() => {
    socket.on("initial-output",(output) => {
          setOutput(output);
          }
        );
        return () => {
          socket.off("initial-output");
        };
      }, []);


  useEffect(() => {
    socket.on("initial-messages",(messages) => {
        setMessages(messages);
        }
      );
        return () => {
          socket.off("initial-messages");
        };
      }, []);


  useEffect(() => {
    socket.on("message-received",(message) => {
        setMessages(
          prev => [
            ...prev,
            message
          ]
        );
      }
    );
    return () => {
      socket.off("message-received");
    };
  }, []);
  // send updates

  const sendMessage = () => {
    if (!message.trim())
      return;

    socket.emit("send-message",
      {
        roomId,
        username:
          user.username,
        message
      }
    );
    setMessage("");

  };
  const handleCodeChange = (value) => {

    setCode(value);

    socket.emit(
      "code-change",
      {
        roomId,
        code: value
      }
    );

  };

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
    return (
      <div className="room-page room-loading">
        <span className="loading-prompt">
          &gt; loading room<span className="blink">_</span>
        </span>
      </div>
    );
  }

  const handleRun = async () => {
    try {
      const response = await runCode(language, code);
      setOutput(response.output);
      socket.emit("output-change",{roomId,output:response.output}

);
    } 
    catch (error) {
      setOutput(error.response?.data?.message);
    }
  };

  return (
    <div className="room-page">

      {/* <h3>Members</h3>
      <ul>
        {members.map((member) => (
          <li key={member.user_id}>
            {member.user_id}
          </li>
        ))}
      </ul> */}

      <div className="room-titlebar">
        <div className="terminal-dots">
          <span className="dot dot-red"></span>
          <span className="dot dot-amber"></span>
          <span className="dot dot-green"></span>
        </div>
        <span className="terminal-path">~/room/{room.room_code}/{user.username}</span>
        <span className="live-badge">
          <span className="pulse-dot"></span>
          LIVE
        </span>
      </div>

      <div className="room-content">

        <div className="editor-panel">

          <div className="editor-toolbar">

            <select
              className="select"
              value={language}
              onChange={(e) => {

                const newLanguage =
                  e.target.value;

                setLanguage(
                  newLanguage
                );

                socket.emit(
                  "language-change",
                  {
                    roomId,
                    language:
                      newLanguage
                  }
                );

              }}
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

            <button className="btn btn-primary" onClick={handleRun}>
              Run
            </button>

          </div>

          <div className="editor-shell">
            <Editor
              height="500px"
              language={language}
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
            />
          </div>

          <div className="panel output-panel">
            <div className="panel-header">Output</div>
            <pre>{output}</pre>
          </div>

        </div>

        <div className="sidebar">

          <div className="panel participants-panel">
            <div className="panel-header">Online — {participants.length}</div>
            <ul className="participant-list">
              {participants.map(
                (user) => (
                  <li
                    key={user.socketId}
                    className="participant-item"
                  >
                    <span className="status-dot"></span>
                    {user.username}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="panel chat-panel">
            <div className="panel-header">Chat</div>

            <div className="chat-messages">
              {messages.map(
                (msg, index) => (
                  <div key={index} className="chat-message">
                    <strong>
                      {msg.username}
                    </strong>
                    {" : "}
                    {msg.message}
                  </div>
                )
              )}
            </div>

            <div className="chat-input-row">
              <input
                className="input"
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                placeholder="Type message..."
              />

              <button
                className="btn btn-primary"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
  }

export default Room;