import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../contex/authContex";
import { useGetMessageHistory } from "../api/messageMutation";


const Messages = ({ currentChat }) => {
  const { data: messages } = useGetMessageHistory(currentChat._id);
  const scrollRef = useRef();
  const { authUser,renderStatusIcon,getMessageStatus } = useAuth();


  useEffect(() => {
    if (scrollRef.current) {
      const x = window.scrollX;
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      window.scrollTo(x, window.scrollY);
    }
  }, [messages]);

  const time = (message) => {
    if (message) {
      const dateObj = new Date(message.createdAt);
      return dateObj.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      <div className="space-y-3 md:space-y-4">
        {messages &&
          messages.map((message) =>
            message.type === "label" ? (
              <div key={message._id} className="my-3 text-center">
                <span className="text-gray-100 text-xs md:text-sm">
                  {message.label}
                </span>
              </div>
            ) : (
              <MessageBubble
      key={message._id}
      message={message}
      isOwn={message.sender._id === authUser._id}
      time={time}
      renderStatusIcon={renderStatusIcon}
      getMessageStatus={getMessageStatus}
      chatId={currentChat?._id}
    />
            )
          )}
        <div ref={scrollRef} />
      </div>
    </div>
  );
};

export default Messages;


const MessageBubble = ({ message, isOwn, time, renderStatusIcon, getMessageStatus, chatId }) => {
  const [removePadding, setRemovePadding] = useState(false);
  const messageRef = useRef(null);

  useEffect(() => {
    const el = messageRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setRemovePadding(width >= 80); // 5rem = 80px
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      {/* <div
        className={`max-w-[85%] md:max-w-xs lg:max-w-md px-3 pt-3 pb-5 rounded-2xl relative ${
          isOwn
            ? `bg-gradient-to-r from-purple-500 to-blue-500 text-white ml-auto ${
                removePadding ? '' : 'pr-20'
              }`
            : `bg-white/20 backdrop-blur-sm text-white border border-white/30 ${
                removePadding ? '' : 'pr-16'
              }`
        }`}
      > */}
      <div
        className={`max-w-[85%] shadow md:max-w-xs lg:max-w-md px-3 pt-3 pb-5 text-white rounded-2xl relative ${
          isOwn
            ? `bg-gradient-to-r from-slate-200/30 to-purple-500/20 ml-auto ${
            // ? `bg-gradient-to-r from-blue-500 to-purple-500  ml-auto ${
                removePadding ? '' : 'pr-20'
              }`
            : `bg-white/20 backdrop-blur-sm ${
                removePadding ? '' : 'pr-16'
              }`
        }`}
      >
        <p ref={messageRef} className="text-sm leading-relaxed break-words">
          {message.content}
        </p>
        <p
          className={`text-[11px] mt-1 flex items-center absolute right-2 bottom-1 ${
            isOwn ? 'text-white/80' : 'text-white/60'
          }`}
        >
          {time(message)}
          {isOwn && renderStatusIcon(getMessageStatus(message,chatId))}
        </p>
      </div>
    </div>
  );
};


