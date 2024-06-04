import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const ENDPOINT = "http://localhost:5000";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    const socket = socketIOClient(ENDPOINT);
    if (inputMessage.trim() !== "") {
      socket.emit("chat message", `${username}: ${inputMessage}`);
      setInputMessage("");
    }
  };

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const handleJoinChat = () => {
    const socket = socketIOClient(ENDPOINT);
    if (username.trim() !== "") {
      socket.emit("join", username);
    }
  };

  return (
    <div>
      <h1>Chat Room</h1>
      <div>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={handleUsernameChange}
        />
        <button onClick={handleJoinChat}>Join Chat</button>
      </div>
      <div>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
      <div>
        <input
          type="text"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={handleInputChange}
          onKeyPress={handleEnterKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
