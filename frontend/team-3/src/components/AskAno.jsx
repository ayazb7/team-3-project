import React, { useState, useEffect, useRef, use } from "react";
import { SlArrowUpCircle } from "react-icons/sl";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import CourseCard from "./CourseCard";
const ChatBubble = ({ message, sender, className }) => {
  return (
    <div class="flex items-start gap-2.5">
      <div
        class={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-lg dark:bg-gray-700 ${className}`}
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

const Ano = ({ isOpen, setIsOpen, className }) => {
  return (
    <div className={`${className} rounded-full z-999`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={` select-none size-12  lg:size-20 rounded-full flex flex-col justify-center items-center text-white sky-gradient 
    cursor-pointer shadow-xl z-999`}
      >
        <p className="lg:text-base/2 hidden lg:block">Ask</p>
        <p className="lg:text-2xl">Ano</p>
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
  const [coursesInChat, setCoursesInChat] = useState([]);

  let navigate = useNavigate();
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
      if (partialResponseRef.current) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { isCourse: false, sender: "Ano", text: partialResponseRef.current },
        ]);
      }

      console.log(messages);
      setPartialResponse("");
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    socketRef.current.on("response", (data) => {
      setCoursesInChat([]);
      if (data.data) {
        setPartialResponse((prev) => prev + data.data);
      }
      setLoading(false);
    });

    socketRef.current.on("renderCoursesInChat", (data) => {
      console.log(data.data);
      console.log(data.data[0]);

      if (data.data.constructor != Array) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { isCourse: true, sender: "Ano", text: [data.data] },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { isCourse: true, sender: "Ano", text: data.data },
        ]);
      }
      setPartialResponse("");
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
        { isCourse: false, sender: "me", text: trimmedMessage },
      ]);
    }
    setPrompt("");
  };

  return (
    <div
      className={`fixed w-screen h-screen  right-0 flex flex-col gap-5 justify-end p-10 items-end pointer-events-none  ${
        isOpen ? "z-999 !p-0 lg:!p-10" : ""
      }`}
    >
      <div
        className={`${
          isOpen ? "" : "hidden"
        } w-screen lg:w-[50%] xl:w-[30%] h-screen lg:h-full lg:rounded-lg shadow-xl bg-white flex justify-center items-center border-1 sky-gradient pointer-events-auto overflow-hidden`}
      >
        <div className="w-full h-full bg-white/90 backdrop-blur-md flex flex-col overflow-x-hidden">
          <div className="fixed w-full h-[9%] flex flex-col justify-center items-center">
            <div className="h-full bg-white w-full shadow-xl flex flex-col justify-center items-center">
              <h1>Ask Ano</h1>
            </div>

            <div className=" w-full h-[4%] bg-gradient-to-r from-[#ff8a01] via-[#ac1ec4] to-[#1c50fe] opacity-90  "></div>
          </div>
          <div className="left-0 top-1/2 -translate-y-1/2 w-0 h-8 bg-gradient-to-b from-[#ac1ec4] to-[#1c50fe] rounded-r-full group-hover:w-1 transition-all duration-200"></div>
          <div className="pt-[20%] md:pt-0  flex flex-col h-full w-full px-2 md:px-10 ">
            <div className="w-full h-full flex flex-col-reverse gap-5 overflow-y-scroll scrollbar-hide">
              <div ref={bottomRef} className="flex flex-row gap-3">
                <ChatBubble
                  className={`${loading ? "block " : "hidden"} animate-pulse`}
                  message="Ano is thinking..."
                  sender=""
                />
                {messages.length === 0 && (
                  <div className="flex flex-row gap-3 mb-2 p-2 rounded self-start">
                    <p>Ask me anything about Sky Wise! I'm here to help.</p>
                  </div>
                )}
              </div>
              {partialResponse && (
                <div className="text-sm font-normal py-2.5 text-black dark:text-white whitespace-pre-wrap prose ">
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {partialResponse}
                  </Markdown>
                </div>
              )}
              {messages.toReversed().map((msg, index) => {
                return (
                  <div
                    key={index}
                    className={`mb-2 p-2 rounded ${
                      msg.sender === "me"
                        ? "self-end"
                        : "flex justify-center items-center"
                    }`}
                  >
                    {msg.sender === "me" ? (
                      <ChatBubble message={msg.text} sender="" />
                    ) : (
                      (msg.isCourse && (
                        <div className="flex flex-col gap-3 ">
                          {msg.text.map((item, idx) => {
                            return (
                              <CourseCard {...item} background="bg-gray-200" />
                            );
                          })}
                        </div>
                      )) || (
                        <div className="text-sm font-normal py-2.5 text-gray-900 dark:text-white whitespace-pre-wrap prose ">
                          <Markdown remarkPlugins={[remarkGfm]}>
                            {msg.text}
                          </Markdown>
                        </div>
                      )
                    )}
                  </div>
                );
              })}
            </div>
            <form
              className="flex justify-center items-center w-full h-26 px-2 md:px-10 mt-auto gap-2"
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
                className="w-full bg-transparent outline-none focus:ring-0 placeholder-slate-500 border-1 border-black rounded-lg p-2 flex-1"
              />
              <SlArrowUpCircle
                size={30}
                className="text-black hover:text-blue-500 cursor-pointer"
                type="submit"
              />
              <Ano
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                className={"flex-none lg:hidden"}
              />
              <input type="submit" className="hidden" />
            </form>
          </div>
        </div>
      </div>
      <Ano
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        className={`pointer-events-auto ${
          isOpen
            ? "hidden lg:block justify-self-end justify-self-auto self-auto"
            : "block"
        }`}
      />
    </div>
  );
};

export default AskAno;
