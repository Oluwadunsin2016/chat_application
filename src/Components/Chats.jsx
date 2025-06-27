import React, { useEffect, useState } from "react";
import { LoaderCircle, Search, Settings } from "lucide-react";
import { useGetChats, useMarkAsRead } from "../api/messageMutation.js";
import { useGetAllUsers } from "../api/authMutation.js";
import { useAuth } from "../contex/authContex.jsx";
import { useChatStore } from "../store/useChatStore.js";
import { useGetGroups, useMarkGroupAsRead } from "../api/groupMutation.js";

const Chats = ({
  currentUser,
  showChat,
  onlineUsers,
}) => {
  const [currentSelected, setCurrentSelected] = useState(undefined);
   const [searchTerm, setSearchTerm] = useState('');
  const [currentChats, setCurrentChats] = useState([])
const [dots, setDots] = useState("");
const {typingUsers, chats:allChats} = useChatStore();


   const {data:chats, isPending:isLoading} = useGetChats()
   const {mutateAsync:markAsRead}=useMarkAsRead()
   const {mutateAsync:markGroupMessageAsRead}=useMarkGroupAsRead()
     const {data} = useGetGroups()
    const {data:users} = useGetAllUsers()
    const {handleCurrentChat,handleGroupMode,currentChat, groupMode,renderStatusIcon,getMessageStatus} = useAuth()
  


   useEffect(() => {
    setCurrentChats(chats)

     return () => {
       if (!groupMode&&currentChat) {
        markAsRead({from:currentChat?._id})
       }
       if (groupMode&&currentChat) {
        markGroupMessageAsRead({groupId:currentChat?._id})
       }
     }
   }, [chats])


   useEffect(() => {
 if (allChats?.length>0) {
  setCurrentChats(allChats)
 }
   }, [allChats])
   
   

  const changeCurrentChat = (id, type) => {
    console.log(id);
    setCurrentSelected(id);
    if (type=='private') {
      if (currentUser._id!==id) {
        markAsRead({from:id})
      }
      if (users) {
        const foundUser = users?.data.find(user=>user._id===id)
        handleCurrentChat(foundUser);
      }   
      handleGroupMode(false);
    }else{
      markGroupMessageAsRead({groupId:id})
      const foundGroup = data?.groups?.find(group=>group._id===id)
      handleCurrentChat(foundGroup)
      handleGroupMode(true);
    }
    showChat();
  };


  const time = (createdAt) => {
    if (createdAt) {
      const dateObj = new Date(createdAt);
      const hours = dateObj.getHours();
      const minutes = dateObj.getMinutes();

      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);

      const timeIn12Hrs = date.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return timeIn12Hrs;
    }
  };


  const filteredChats = currentChats?.filter(chat =>
    chat?.otherUser?.userName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    chat?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    chat?.otherUser?.firstName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    chat?.otherUser?.lastName?.toLowerCase().includes(searchTerm?.toLowerCase())
  );



  // useEffect(() => {
  //   const handleTyping = ({ from }) => {
  //     console.log(`${from} is typing...`);
  //     setTypingUsers((prev) => {
  //       if (!prev.includes(from)) {
  //         return [...prev, from];
  //       }
  //       return prev;
  //     });
      
  //   };
  
  //   const handleStopTyping = ({ from }) => {
  //     setTypingUsers((prev) => prev.filter((id) => id !== from));
  //   };
  
  //   socket.on("user-typing", handleTyping);
  //   socket.on("user-stopped-typing", handleStopTyping);
  
  //   return () => {
  //     socket.off("user-typing", handleTyping);
  //     socket.off("user-stopped-typing", handleStopTyping);
  //   };
  // }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
  
    return () => clearInterval(interval);
  }, []);


//   const message=useCallback((id)=>{
// const reccent=messages?.find(msg=>msg._id==id)
// console.log("reccentMessage:", messages);

// return reccent;
//   },[messages])
  
  

  return (
    <div className="">
      <div className="p-4 md:p-6 border-b border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
          Chats
          </h1>
          <Settings className="w-5 h-5 md:w-6 md:h-6 text-white/70 hover:text-white cursor-pointer transition-colors" />
        </div>
        
        {/* Search */}
        <div className="!relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/20 border border-white/30 rounded-xl py-2 md:py-3 !pl-10 pr-4 text-sm md:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
          />
        </div>
      </div>
      {isLoading ? (
   <div className="flex items-center justify-center mt-12">
        <LoaderCircle size={30} className="animate-spin" />
     </div> 
      ) : (
        <div className="space-y-6 overflow-y-auto h-[75vh] px-5 mt-4">
        {filteredChats?.length === 0 ? (
          <div className="text-white text-center">
            <h5>Your chat history is empty!</h5>
          </div>
        ) : (
          filteredChats?.map((chat) => {
            const isPrivate = chat.type === "private";
            // const isGroup = chat.type === "group";
            const displayName = isPrivate ? chat.otherUser?.userName : chat?.name;
            const displayImage = isPrivate ? chat.otherUser?.profileImage : chat?.profileImage;
            const isOnline = isPrivate && onlineUsers.includes(chat.otherUser._id);
            const isTyping = isPrivate && typingUsers.includes(String(chat.otherUser._id));
            const displayText = isTyping ? `Typing${dots}` : chat?.lastMessage?.content || "";
            const displayId = isPrivate ? chat.otherUser._id : chat?.lastMessage?.group;
            

            return (
              <div
                className={`bg-white/10 cursor-pointer flex items-center gap-4 p-2 rounded-lg
                  transition-colors duration-300 ease-in-out
                  hover:bg-white/20
                  ${currentSelected === chat._id && "bg-white/15"}`}
                key={chat._id}
                onClick={() => changeCurrentChat(displayId, chat.type)}
              >
                <div className="flex justify-between px-2 w-full">
                  <div className="flex items-center gap-4">
                    <div className="w-[3rem] h-[3rem] rounded-full relative">
                      <img
                        src={displayImage}
                        alt="picture"
                        className="w-full h-full object-cover object-top rounded-full flex-0"
                      />
                      {isPrivate && (
                        <div className={`${isOnline ? 'bg-green-500' : 'bg-gray-300'} w-3 h-3 rounded-full border border-white absolute top-1 right-0`} />
                      )}
                    </div>
                    <div className="username text-white">
                      <h4 className="font-semibold tracking-wide">{displayName}</h4>
                      <div className="text-sm text-gray-300">{displayText?.length > 20 
  ? displayText.substring(0, 20) + '...' 
  : displayText}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-gray-200 text-xs">{time(chat.lastMessage?.createdAt)}</p>
                    {chat.unreadCount > 0 ? (
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">{chat.unreadCount}</span>
                      </div>
                    ): (
                      isPrivate &&
                      chat?.lastMessage?.sender?._id === currentUser?._id && !isTyping && (
                        <div className="text-xs text-white/70">
                          {renderStatusIcon(getMessageStatus(chat?.lastMessage,chat?.otherUser._id))}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      )}
    </div>
  );
};

export default Chats;