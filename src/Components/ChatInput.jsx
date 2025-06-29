
import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Emoji from "./Emoji";
import { Send, Smile } from "lucide-react";
import { useSendMessage } from "../api/messageMutation";
import { useAuth } from "../contex/authContex";
import socket from "../main";

const ChatInput = ({currentChat}) => {
// const inputRef=createRef()
const inputRef=useRef()
const emojiRef=useRef()
const [msg, setMsg] = useState("");
const [emojiStatus, setemojiStatus] = useState(false);
const [cursorPosition, setcursorPosition] = useState("")
const {mutateAsync:sendMessage} = useSendMessage()
const { authUser:currentUser } = useAuth();
// let typingTimeout;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setemojiStatus(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

const showEmojiPicker = () => {
  setemojiStatus(!emojiStatus);
};

const handleEmojiClick=({emoji})=>{
  socket.emit("typing", {
    from: currentUser._id,
    to: currentChat._id,
  });

  const ref=inputRef.current;
  ref.focus()
  const start=msg.substring(0,ref.selectionStart)
  const end=msg.substring(ref.selectionStart)
  let message= start + emoji + end
  setMsg(message)
  setcursorPosition(start.length+emoji.length)
}

// const handleEmojiClick = ({ emoji }) => {
//   const ref = inputRef.current;
//   console.log('emoji:', emoji);
//   if (!ref) return; // Prevent crashing if ref is still null

//   setMsg((prev) => {
//     const start = prev.substring(0, ref.selectionStart);
//     const end = prev.substring(ref.selectionStart);
//     const newMsg = start + emoji + end;

//     setTimeout(() => {
//       ref.focus();
//       ref.selectionEnd = start.length + emoji.length;
//     }, 0);

//     return newMsg;
//   });
// };

useEffect(() => {
  inputRef.current.selectionEnd=cursorPosition
}, [cursorPosition])

const sendChat=async()=>{
  if (msg.length>0) {
    //  handleSendMsg(msg)
    await sendMessage({
      from: currentUser._id,
      to: currentChat._id,
      message:msg,
    },{onSuccess:()=>{
      setMsg("")
      socket.emit("send-message", {
        from: currentUser._id,
        to: currentChat._id,
      });
    }})
    socket.emit("stop-typing", {
      from: currentUser._id,
      to: currentChat._id,
    });
  }
}

const handleKeyPress = (e) => {
  socket.emit("typing", {
    from: currentUser._id,
    to: currentChat._id,
  });

  if (e.key === 'Backspace' || e.key === 'Delete') {
    e.preventDefault(); // stop default behavior (optional but useful)

    // Remove the last character manually
    if (msg?.length<=1) {
      socket.emit("stop-typing", {
        from: currentUser._id,
        to: currentChat._id,
      });
    }
    if (msg?.length>0) {
      setMsg((prev) => prev.slice(0, -1)); 
    }
  }

  // Debounce "stop-typing"
  // clearTimeout(typingTimeout);
  // typingTimeout = setTimeout(() => {
  //   socket.emit("stop-typing", {
  //     from: currentUser._id,
  //     to: currentChat._id,
  //   });
  // }, 3000); 
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChat();
  }
};

  const handleInputChange = (e) => {
    const newMessage = e.target.value;
    setMsg(newMessage);
    socket.emit("typing", {
      from: currentUser._id,
      to: currentChat._id,
    });

    // Debounce "stop-typing"
    // clearTimeout(typingTimeout);
    // typingTimeout = setTimeout(() => {
    //   socket.emit("stop-typing", {
    //     from: currentUser._id,
    //     to: currentChat._id,
    //   });
    // }, 3000); // stop after 1 second of no typing
  };
  


  return (
<div className="p-2 md:p-4 border-t !bg-amber-50/15 border-gray-50/15 backdrop-blur-lg flex-shrink-0">
<div className="flex !items-center !gap-2 md:!gap-3">
<div ref={emojiRef} className="!relative ">
<div
  className={`
    absolute bottom-16 left-2 z-50
    transition-all duration-500 ease-in-out
    transform
    ${emojiStatus
      ? 'opacity-100 translate-y-0 visible'
      : 'opacity-0 translate-y-16 invisible'}
  `}
>
  <Emoji handleEmojiClick={handleEmojiClick} />
</div>
    <button onClick={showEmojiPicker} className="cursor-pointer text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-all mt-2">
      <Smile className="w-4 h-4 md:w-5 md:h-5" />
    </button>
    </div>
  <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 focus-within:ring-2 focus-within:ring-purple-400 transition-all min-w-0">
    <textarea
    ref={inputRef}
      value={msg}
      onChange={handleInputChange}
      onKeyDown={handleKeyPress}
      placeholder="Type your message..."
      className="w-full bg-transparent px-3 md:px-4 py-1 mt-1 md:mt-2 text-sm md:text-base text-white placeholder-white/50 resize-none focus:outline-none max-h-32"
      rows={1}
    />
  </div> 
    <button
      onClick={sendChat}
      disabled={!msg.trim()}
      className="p-2 md:p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
    >
      <Send className="w-4 h-4 md:w-5 md:h-5" />
    </button>
</div> 
</div> 
  );
};

export default ChatInput;