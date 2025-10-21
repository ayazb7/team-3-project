import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const BotRender = () => {
  const [prompt, setPrompt] = useState("");
  const [data, setData] = useState(null);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const handleChange = (e) => {
    setPrompt(e.target.value);
  };
  // const onSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log("submitted prompt:", prompt);

  //   try {
  //     const response = await axios.post("http://localhost:5000/chat/generate", {
  //       prompt,
  //     });
  //     setData(response.data.response);
  //     console.log("Response from server:", response.data);
  //   } catch (error) {
  //     console.error("Error submitting prompt:", error);
  //   }
  // };

  useEffect(() => {
    socketRef.current = io("http://localhost:5000/chat", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socketRef.current.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log("received message:", message);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    socketRef.current.on("response", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "server", text: data.data },
      ]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (socketRef.current) {
      console.log("sent message:", prompt);
      let trimmedMessage = prompt.trim();
      socketRef.current.send(trimmedMessage);

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "me", text: trimmedMessage },
      ]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/*
      <form className="bg-white p-6 rounded shadow-md w-full max-w-md flex flex-row gap-4"
      onSubmit={onSubmit}
      >
        <label for="prompt">Enter Your Prompt:</label>
        <input type="text" name="prompt" onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      {data && (
        <div
          dangerouslySetInnerHTML={{ __html: data }}
          className="mt-6 bg-white p-4 rounded shadow-md w-full max-w-md"
        ></div>
      )}
        */}

      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-md flex flex-row gap-4"
        onSubmit={sendMessage}
      >
        <label for="prompt">Enter Your Prompt:</label>
        <input type="text" name="prompt" onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      <div className="mt-6 bg-white p-4 rounded shadow-md w-full max-w-md">
        {messages.map((msg, index) => {
          return (
            <div
              key={index}
              className={`mb-2 p-2 rounded ${
                msg.sender === "me"
                  ? "bg-blue-200 self-end"
                  : "bg-gray-200 self-start"
              }`}
            >
              <span>{msg.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BotRender;
