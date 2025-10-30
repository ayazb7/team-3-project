import React, { useState, useEffect, useRef, use } from "react";
import { SlArrowUpCircle } from "react-icons/sl";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { io } from "socket.io-client";
const ChatBubble = ({ message, sender, className }) => {
  return (
    <div class="flex items-start gap-2.5">
      <div
        class={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100   ${
          sender == "me"
            ? "rounded-xl rounded-se-none"
            : " rounded-xl rounded-ss-none"
        }  dark:bg-gray-700 ${className}`}
      >
        <div class="flex items-center space-x-2 rtl:space-x-reverse">
          <span class="text-sm font-semibold text-gray-900 dark:text-white">
            {sender}
          </span>
        </div>
        <div class="text-sm font-normal py-2.5 text-gray-900 dark:text-white whitespace-pre-wrap prose ">
          <Markdown remarkPlugins={[remarkGfm]}>{message}</Markdown>
        </div>
      </div>
    </div>
  );
};

const AskAno = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [partialResponse, setPartialResponse] = useState("");
  const partialResponseRef = useRef("");

  const handleChange = (e) => {
    setPrompt(e.target.value);
  };

  useEffect(() => {
    socketRef.current = io("http://localhost:5000/chat", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socketRef.current.on("completed", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Ano", text: partialResponseRef.current },
      ]);
      setPartialResponse("");
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    socketRef.current.on("response", (data) => {
      setPartialResponse((prev) => prev + data.data);
      setLoading(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }

    partialResponseRef.current = partialResponse;
  }, [messages, partialResponse]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (socketRef.current) {
      console.log("sent message:", prompt);
      let trimmedMessage = prompt.trim();
      socketRef.current.send(trimmedMessage);

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "me", text: trimmedMessage },
      ]);
    }
    setPrompt("");
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-9/10 -translate-y-1/2 right-20 size-25 rounded-full flex flex-col justify-center items-center text-white sky-gradient active:animation-ping 
    cursor-pointer shadow-xl`}
      >
        <p className="text-base/2">Ask</p>
        <p className="text-2xl">Ano</p>
      </div>

      <div
        className={`${
          isOpen ? "" : "hidden"
        } fixed w-150 h-200 bg-white bg-opacity-25 rounded-lg right-20 top-1/2 -translate-y-1/2 border-5 shadow-xl`}
      >
        <div className="flex flex-col h-full w-full px-10 ">
          <div className="w-full h-full flex flex-col-reverse gap-5 overflow-y-scroll scrollbar-hide">
            <div ref={bottomRef} className="flex flex-row gap-3">
              <ChatBubble
                className={`${loading ? "block " : "hidden"} animate-pulse`}
                message="Ano is thinking..."
                sender=""
              />
              {messages.length === 0 && (
                <ChatBubble
                  message="Hi! I'm Ano, your AI assistant. Ask me anything!"
                  sender="Ano"
                />
              )}
            </div>
            {partialResponse && (
              <div className="flex flex-row gap-3 mb-2 p-2 rounded self-start">
                <ChatBubble
                  className="animate-pulse"
                  message={partialResponse}
                  sender="Ano"
                />
              </div>
            )}
            {messages.toReversed().map((msg, index) => {
              return (
                <div
                  key={index}
                  className={`mb-2 p-2 rounded ${
                    msg.sender === "me" ? "self-end" : "self-start"
                  }`}
                >
                  <ChatBubble message={msg.text} sender={msg.sender} />
                </div>
              );
            })}
          </div>
          <form
            className="flex justify-center items-center w-full h-26 px-10 mt-auto gap-2"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              required
              aria-label="prompt"
              placeholder="Ask anything"
              name="prompt"
              value={prompt}
              onChange={handleChange}
              autoComplete="off"
              className="w-full bg-transparent outline-none focus:ring-0 placeholder-slate-500 border-1 rounded-lg p-2"
            />
            <SlArrowUpCircle
              size={30}
              className="text-gray-500 hover:text-blue-500 cursor-pointer"
              type="submit"
            />
            <input type="submit" className="hidden" />
          </form>
        </div>
      </div>
    </>
  );
};

export default AskAno;
