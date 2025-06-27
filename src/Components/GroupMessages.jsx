
import React, { useEffect, useRef, useState } from "react";
import { useGetMessageHistory } from "../api/groupMutation";
import { useAuth } from "../contex/authContex";

const GroupMessages = ({
  currentGroup,
}) => {
   const {data:messages} = useGetMessageHistory(currentGroup._id)
      const { authUser } = useAuth();

  const scrollRef=useRef()
useEffect(() => {
  if (scrollRef.current) {
    const el = scrollRef.current;
    // Lock current horizontal scroll before scrolling vertically
    const x = window.scrollX;
    el.scrollIntoView({ behavior: "smooth", block: "end" });
    window.scrollTo(x, window.scrollY);
  }
}, [messages]);

 

const time=(message)=>{
    if (message) {
         const dateObj = new Date(message.createdAt);

        const timeIn12Hrs = dateObj.toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        return timeIn12Hrs;
    }
  }


  

  return (
    <div className="flex-1 overflow-y-auto space-y-3 md:space-y-4">

{messages &&
        messages?.map(message =>
  message.type === 'label' ? (
    <div key={message._id} className="my-3 text-center">
     <span className="text-gray-100 text-xs md:text-sm">{message.label}</span>
    </div>
  ) : (

    <MessageBubble
    key={message._id}
    message={message}
    isOwn={message.sender._id === authUser._id}
    time={time}
  />
  )
)}
    <div ref={scrollRef}/>
    </div>
  );
};

export default GroupMessages;


const MessageBubble = ({ message, isOwn, time, }) => {
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
    <div
key={message.id}
className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}
>
<div   className={`max-w-[85%] shadow md:max-w-xs lg:max-w-md px-3 pt-3 pb-5 text-white rounded-2xl relative ${
                removePadding ? '' : 'pr-16'
              } ${
          isOwn
            ? "bg-gradient-to-r from-slate-200/30 to-purple-500/20 ml-auto"
            : "bg-white/20 backdrop-blur-sm"
        }`}>
  {!isOwn&& (
                <p className="text-xs font-semibold mb-1 text-purple-300">{message?.sender?.firstName} {message?.sender?.lastName}</p>
              )}
  <p className="text-sm leading-relaxed break-words">{message?.content?.length > 20 
? message?.content.substring(0, 20) + '...' 
: message?.content}</p>
  <p  className={`text-xs mt-1 flex items-center absolute right-2 bottom-1 ${
            isOwn ? 'text-white/80' : 'text-white/60'
         }`}>
   {time(message)}
  </p>
</div>
</div>
  );
};
    // <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}>
    //   <div
    //     className={`max-w-[85%] shadow md:max-w-xs lg:max-w-md px-3 pt-3 pb-5 text-white rounded-2xl relative ${
    //       isOwn
    //         ? `bg-gradient-to-r from-slate-200/30 to-purple-500/20 ml-auto ${
    //             removePadding ? '' : 'pr-20'
    //           }`
    //         : `bg-white/20 backdrop-blur-sm ${
    //             removePadding ? '' : 'pr-16'
    //           }`
    //     }`}
    //   >
    //     <p ref={messageRef} className="text-sm leading-relaxed break-words">
    //       {message.content}
    //     </p>
    //     <p
    //       className={`text-xs mt-1 flex items-center absolute right-2 bottom-1 ${
    //         isOwn ? 'text-white/80' : 'text-white/60'
    //       }`}
    //     >
    //       {time(message)}
    //       {/* {isOwn && renderStatusIcon(getMessageStatus(message))} */}
    //     </p>
    //   </div>
    // </div>



