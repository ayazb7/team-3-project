import React, { useState } from "react";
import { SlArrowUpCircle } from "react-icons/sl";

const ChatBubble = () => {
  return (
    <div class="flex items-start gap-2.5">
      <div class="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
        <div class="flex items-center space-x-2 rtl:space-x-reverse">
          <span class="text-sm font-semibold text-gray-900 dark:text-white">
            BOT
          </span>
        </div>
        <p class="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
          Yes. You find your currently enrolled courses in the dashboard.
        </p>
      </div>
    </div>
  );
};

const AskAno = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={`${
          isOpen ? "hidden" : ""
        } fixed top-9/10 -translate-y-1/2 right-20 size-25 rounded-full flex flex-col justify-center items-center text-white sky-gradient active:animation-ping 
    cursor-pointer`}
      >
        <p className="text-base/2">Ask</p>
        <p className="text-2xl">Ano</p>
      </div>

      <div
        className={`${
          isOpen ? "" : "hidden"
        } fixed w-150 h-200 bg-white bg-opacity-25 rounded-lg right-20 top-1/2 -translate-y-1/2 border-2 `}
      >
        <div className="flex flex-col h-full w-full px-20 ">
          <button
            className="bg-blue-200 h-10 w-36"
            onClick={() => setIsOpen(false)}
          >
            {" "}
            close
          </button>
          <div className="w-full h-full flex flex-col-reverse gap-5 overflow-y-scroll scrollbar-hide">
            <ChatBubble />
            <ChatBubble />
            <ChatBubble />
            <ChatBubble />
            <ChatBubble />
            <ChatBubble />
            <ChatBubble />
            <ChatBubble />
          </div>
          <div className="flex justify-center items-center w-full h-26 px-10 mt-auto gap-2">
            <input
              type="email"
              required
              aria-label="Email"
              placeholder="Ask anything"
              className="w-full bg-transparent outline-none focus:ring-0 placeholder-slate-500 border-1 rounded-lg p-2"
            />
            <SlArrowUpCircle
              size={30}
              className="text-gray-500 hover:text-blue-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AskAno;
