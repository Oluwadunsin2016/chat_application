
import React, { useEffect, useMemo, useRef, useState } from "react";
import Contacts from "../Components/Contacts";
import Welcome from "../Components/Welcome";
import Messages from "../Components/Messages";
import ChatInput from "../Components/ChatInput";
import SideIcons from "../Components/SideIcons";
import Chats from "../Components/Chats";
import Groups from "../Components/Groups";
import GroupMembers from "../Components/GroupMembers";
import AddGroupMember from "../Components/AddGroupMember";
import GroupInformation from "../Components/GroupInformation";
import GroupMessages from "../Components/GroupMessages";
import GroupChatInput from "../Components/GroupChatInput";
import CurrentMemberInfo from "../Components/CurrentMemberInfo";
import Profile from "../Components/Profile";
import LastSeen from "../Components/LastSeen";
import { CircleArrowLeft, MoreVertical, Phone, Search, Video, X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuth } from "../contex/authContex";
import { useGetMembers } from "../api/groupMutation";

const Chat = () => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentPosition, setCurrentPosition] = useState("Chats");
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [dots, setDots] = useState("");
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [rightSidebarContent, setRightSidebarContent] = useState(null);
  const [backTo, setBackTo] = useState(null);
  const [current, setCurrent] = useState(0);
  const [showDrawer, setShowDrawer] = useState(false)

  const dropdownRef = useRef(null);


 const {onlineUsers, typingUsers} = useChatStore();
 const { authUser:currentUser, currentChat, groupMode,handleCurrentChat,handleGroupMode} = useAuth();

    const {data:data} = useGetMembers(groupMode?currentChat?._id:null)
 
   
    
 
      const availableMembers= useMemo(() => {
        return data?.members
      },[data]);

 useEffect(() => {
 if (currentChat) {
  setCurrent(1);
 }
 }, [])
 
  

  const open = () => {
    document.querySelector(".proCover").classList.remove("d-none");
  };

  const changeGroupFunction = (name) => {
    toggleRightSidebar(name);
    setBackTo(name)
    setShowDropdown(false);
  };


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mobile navigation functions
  const showChatWindow = () => {
    setCurrent(1);
  };

  const showLeftSidebar = () => {
    setCurrent(0);
    setTimeout(() => {
      handleGroupMode(false)
      handleCurrentChat(null)
    }, 1000);
  };

  const showRightSidebarMobile = (content) => {
    setRightSidebarContent(content);
    setShowDrawer(true);
  };

  const closeRightSidebarMobile = () => {
    setShowDrawer(false);
  };

  const toggleRightSidebar = (content = null) => {
    console.log("Toggle Right Sidebar:", content);
    
    if (content) {
      setRightSidebarContent(content);
    }
    setShowRightSidebar(true);
  };

  const closeRightSidebar = () => {
    setShowRightSidebar(false);
  };

  const handleViewDetails= (user) => {
    setCurrentMember(user);
    toggleRightSidebar("User Information");
    showRightSidebarMobile("User Information");
  }

    useEffect(() => {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
      }, 400);
    
      return () => clearInterval(interval);
    }, []);
  

  const noOfOnlineMembers=useMemo(()=>{
  const nos =  availableMembers?.filter((info)=>onlineUsers.includes(info?.member._id))
  return nos?.length
  },[availableMembers,onlineUsers])

  return (
    <>
      <div className="h-screen flex bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 text-white overflow-hidden">
         {/* Mobile View */}
        <div
        className="relative md:hidden w-full min-h-screen overflow-hidden"
      >
          <div
              className={`absolute top-0 left-0 w-full h-[100dvh] transition-transform duration-500 ease-in-out ${
                current === 0
                  ? 'translate-x-0'
                  : current > 0
                  ? '-translate-x-full'
                  : 'translate-x-full'
              }`}
          >
          <div className="h-[100dvh] max-h-[100dvh] flex flex-col">
            <div className="py-2 flex-1 bg-white/5 border-gray-50/20 overflow-y-auto">
              {currentPosition === "Chats" && (
                <Chats
                  currentUser={currentUser}
                  showChat={showChatWindow}
                  onlineUsers={onlineUsers}
                />
              )}
              {currentPosition === "Contacts" && (
                <Contacts
                  showChat={showChatWindow}
                  onlineUsers={onlineUsers}
                />
              )}
              {currentPosition === "Groups" && (
                <Groups
                  showChat={showChatWindow}
                />
              )}
              {currentPosition === "Add Member" && (
                <AddGroupMember
                  currentGroup={currentChat}
                  onlineUsers={onlineUsers}
                />
              )}
              {currentPosition === "Profile" && (
                <Profile
                  isCompleted={isCompleted}
                  setIsCompleted={setIsCompleted}
                />
              )}
            </div>
    <SideIcons
      currentPosition={currentPosition}
      setCurrentPosition={setCurrentPosition}
    />
          </div>
          </div>
          <div
            className={`absolute top-0 left-0 w-full h-[100dvh]  transition-transform duration-500 ease-in-out ${
              1 === current
                ? "translate-x-0"
                : 1 > current
                ? "translate-x-full"
                : "-translate-x-full"
            }`}
          >
             {!currentChat ? (
            <Welcome currentUser={currentUser} />
          ) : groupMode ? (
                <div className="flex flex-col h-[100dvh] max-h-[100dvh]">
                  <div className="p-2 md:p-4 border-b bg-amber-50/15 border-gray-50/15">
                    <div className="flex items-center">
                      <div className="mr-3 text-white cursor-pointer hover:opacity-70 transition-opacity" onClick={showLeftSidebar}>
                        <CircleArrowLeft size={20} />
                      </div>
                      <div className="flex items-center justify-between gap-3 flex-1 w-full">
                        <div onClick={() => showRightSidebarMobile("Group Information")} className="flex items-center gap-3">
                          <div className="relative">
                            <img 
                              src={currentChat?.profileImage} 
                              alt="Profile"
                              className="w-10 h-10 md:w-12 md:h-12 cursor-pointer rounded-full object-cover border-2 border-gray-600"
                            />
                          </div>
                          <div>
                            <h2 className="text-white font-semibold  md:text-lg line-clamp-1">
                              {currentChat?.userName || currentChat?.name}
                            </h2>
                          {noOfOnlineMembers>0 && <p className="text-xs md:text-sm text-white/70">
                           {noOfOnlineMembers} {noOfOnlineMembers > 1 ? "Members Online" : "Member Online"}
                            </p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 relative">
                          <Phone className="w-4 h-4 text-white/70 hover:text-white cursor-pointer transition-colors" />
                          <Video className="w-4 h-4 text-white/70 hover:text-white cursor-pointer transition-colors" />
                          <div className="relative" ref={dropdownRef}>
                            <MoreVertical 
                              onClick={() => setShowDropdown(!showDropdown)} 
                              className="w-4 h-4 text-white/70 hover:text-white cursor-pointer transition-colors" 
                            />
                            <div 
                              className={`absolute whitespace-nowrap right-0 top-full mt-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg p-1 z-50 overflow-hidden
                                transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] 
                                ${showDropdown 
                                  ? 'opacity-100 translate-y-0 visible' 
                                  : 'opacity-0 -translate-y-4 invisible'}`}
                            >
                              <ul>
                                {currentChat?.admin?._id == currentUser?._id && (
                                  <li
                                    onClick={() => showRightSidebarMobile("Add Member")}
                                    className="cursor-pointer hover:bg-white/20 py-1.5 px-3 rounded transition-colors text-white text-sm"
                                  >
                                    Add Member
                                  </li>
                                )}
                                <li
                                  onClick={() => showRightSidebarMobile("Group Members")}
                                  className="cursor-pointer hover:bg-white/20 py-1.5 px-3 rounded transition-colors text-white text-sm"
                                >
                                  Group Members
                                </li>
                                <li
                                  onClick={() => showRightSidebarMobile("Group Information")}
                                  className="cursor-pointer hover:bg-white/20 py-1.5 px-3 rounded transition-colors text-white text-sm"
                                >
                                  Group Information
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                    <GroupMessages
                      currentGroup={currentChat}
                    />
                  </div>
                  <GroupChatInput
                    currentGroup={currentChat}
                  />
                </div>
          ) : (
                <div className="flex flex-col h-[100dvh] max-h-[100dvh]">
                  <div className="p-2 md:p-4 border-b bg-amber-50/15 border-gray-50/15">
                    <div className="flex items-center">
                      <div className="mr-3 text-white cursor-pointer hover:opacity-70 transition-opacity" onClick={showLeftSidebar}>
                        <CircleArrowLeft size={20} />
                      </div>
                      <div className="flex items-center justify-between gap-3 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="relative cursor-pointer" onClick={() => handleViewDetails(currentChat)}>
                            <img 
                              src={currentChat.profileImage} 
                              alt="Profile"
                              className="w-10 h-10 md:w-12 md:h-12 cursor-pointer rounded-full object-cover border-2 border-gray-600"
                            />
                            <div className={`${onlineUsers.includes(currentChat._id)?'bg-green-500':'bg-gray-300'} w-2 h-2 md:w-3 md:h-3 rounded-full border border-white absolute top-1 right-0`} />
                          </div>
                          <div>
                            <h2 className="text-white font-semibold md:text-lg line-clamp-1">
                              {currentChat.userName || currentChat.name}
                            </h2>
                            <p className={`text-xs md:text-sm ${onlineUsers?.includes(currentChat._id)?'text-green-500':'text-gray-300'}`}>
                              {onlineUsers?.includes(currentChat?._id) ? (
                                <span>{typingUsers.includes(String(currentChat._id))
                                  ? `Typing${dots}`
                                  : 'Online'}</span>
                                
                              ) : (
                                <LastSeen time={currentChat?.lastSeen} />
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Phone className="w-4 h-4 text-white/70 hover:text-white cursor-pointer transition-colors" />
                          <Video className="w-4 h-4 text-white/70 hover:text-white cursor-pointer transition-colors" />
                          <MoreVertical
                            className="w-4 h-4 text-white/70 hover:text-white cursor-pointer transition-colors" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                    <Messages currentChat={currentChat} />
                  </div>
                  <ChatInput currentChat={currentChat} />
                </div>
          )}
          </div>
      </div>
       {/* Drawer */}
          <div
            className={`fixed md:hidden top-0 right-0 h-full w-full z-50 transform transition-transform duration-500 ease-in-out ${
              showDrawer ? "translate-x-0" : "translate-x-full"
            }`}
          >
           <div className="h-full flex flex-col bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 w-full overflow-y-auto">
            <div className="p-3 border-b bg-amber-50/15 border-gray-50/15 flex gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className=" text-white hover:opacity-70 transition-opacity" onClick={closeRightSidebarMobile}>
                        <X size={20} />
                      </div>
              <h3 className="text-lg font-semibold">{rightSidebarContent}</h3>
            </div>
            <div className="flex items-center gap-4">
          <Search className="w-4 h-4 text-white/70 hover:text-white cursor-pointer transition-colors" />
          <MoreVertical className="w-4 h-4 text-white/70 hover:text-white cursor-pointer transition-colors" />
        </div>
            </div>
            
            <div className="flex-1">
              {rightSidebarContent === "Group Information" && (
                <GroupInformation
                  currentGroup={currentChat}
                  isCompleted={isCompleted}
                  setIsCompleted={setIsCompleted}
                  currentUser={currentUser}
                  setCurrentPosition={showRightSidebarMobile}
                  setCurrentMember={setCurrentMember}
                  onlineUsers={onlineUsers}
                />
              )}
          
              {rightSidebarContent === "Add Member" && (
                <AddGroupMember
                  currentGroup={currentChat}
                  onlineUsers={onlineUsers}
                />
              )}
              {rightSidebarContent === "Group Members" && (
                <GroupMembers
                  currentGroup={currentChat}
                  currentUser={currentUser}
                  setCurrentPosition={showRightSidebarMobile}
                  setCurrentMember={setCurrentMember}
                  onlineUsers={onlineUsers}
                />
              )}
                    {rightSidebarContent === "User Information" && (
                <CurrentMemberInfo
                  showChat={showChatWindow}
                  currentMember={currentMember}
                  setCurrentPosition={setCurrentPosition}
                 closeRightSidebar={closeRightSidebarMobile}
                />
              )}
            </div>
          </div>
          </div>

        {/* Desktop View */}
        <div className="hidden md:flex flex-row h-screen w-full">
          {/* Left Sidebar */}
          <div className="flex-shrink-0 flex w-[28%]">
            <SideIcons
              open={open}
              currentUser={currentUser}
              currentPosition={currentPosition}
              setCurrentPosition={setCurrentPosition}
            />
            <div className="flex-1 py-2 border-r bg-white/5 border-gray-50/20 overflow-y-auto">
              {currentPosition === "Chats" && (
                <Chats
                  currentUser={currentUser}
                  onlineUsers={onlineUsers}
                  showChat={showChatWindow}
                />
              )}
              {currentPosition === "Contacts" && (
                <Contacts
                  isLoading={false}
                  onlineUsers={onlineUsers}
                />
              )}
              {currentPosition === "Groups" && (
                <Groups
                  currentUser={currentUser}
                />
              )}
              {currentPosition === "Add Member" && (
                <AddGroupMember
                  currentGroup={currentChat}
                />
              )}
              {currentPosition === "User Information" && (
                <CurrentMemberInfo
                  currentMember={currentMember}
                  setCurrentPosition={setCurrentPosition}
                  backTo={backTo}
                />
              )}
              {currentPosition === "Profile" && (
                <Profile
                  currentUser={currentUser}
                  isCompleted={isCompleted}
                  setIsCompleted={setIsCompleted}
                />
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className={`flex-1 flex flex-col transition-all duration-500 ease-in-out ${
          showRightSidebar 
            ? "w-[47%]"
            : "w-[72%]"
        }`}>
            {!currentChat? (
              <Welcome currentUser={currentUser} />
            ) : groupMode ? (
                  <div className="flex flex-col h-screen">
                    <div className="p-4 border-b bg-amber-50/15 border-gray-50/15">
                      <div className="flex items-center">
                        <div className="flex items-center justify-between gap-3 flex-1 w-full">
                          <div onClick={() => changeGroupFunction("Group Information")} className="flex items-center gap-3">
                            <div className="relative cursor-pointer">
                              <img 
                                src={currentChat?.profileImage} 
                                alt="Profile"
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                              />
                            </div>
                            <div>
                              <h2 className="text-white font-semibold text-lg line-clamp-1">
                                {currentChat?.userName || currentChat?.name}
                              </h2>
                            {noOfOnlineMembers>0 &&  <p className="text-sm text-white/70">
                                {noOfOnlineMembers} Members Online
                              </p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0 relative">
                            <Phone className="w-6 h-6 text-white/70 hover:text-white cursor-pointer transition-colors" />
                            <Video className="w-6 h-6 text-white/70 hover:text-white cursor-pointer transition-colors" />
                            <div className="relative" ref={dropdownRef}>
                              <MoreVertical 
                                onClick={() => setShowDropdown(!showDropdown)} 
                                className="w-6 h-6 text-white/70 hover:text-white cursor-pointer transition-colors" 
                              />
                              <div 
                                className={`absolute whitespace-nowrap right-0 top-full mt-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg p-1 z-50 overflow-hidden
                                  transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] 
                                  ${showDropdown 
                                    ? 'opacity-100 translate-y-0 visible' 
                                    : 'opacity-0 -translate-y-4 invisible'}`}
                              >
                                <ul>
                                  {currentChat?.admin?._id == currentUser?._id && (
                                    <li
                                      onClick={() => changeGroupFunction("Add Member")}
                                      className="cursor-pointer hover:bg-white/20 py-1.5 px-3 rounded transition-colors text-white text-sm"
                                    >
                                      Add Member
                                    </li>
                                  )}
                                  <li
                                    onClick={() => changeGroupFunction("Group Members")}
                                    className="cursor-pointer hover:bg-white/20 py-1.5 px-3 rounded transition-colors text-white text-sm"
                                  >
                                    Group Members
                                  </li>
                                  <li
                                    onClick={() => changeGroupFunction("Group Information")}
                                    className="cursor-pointer hover:bg-white/20 py-1.5 px-3 rounded transition-colors text-white text-sm"
                                  >
                                    Group Information
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto p-8 space-y-4">
                      <GroupMessages
                        currentGroup={currentChat}
                      />
                    </div>
                    <GroupChatInput
                      currentGroup={currentChat}
                    />
                  </div>
            ) : (
                  <div className="flex flex-col h-screen">
                    <div className="p-4 border-b bg-amber-50/15 border-gray-50/15">
                      <div className="flex items-center justify-between gap-3 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="relative cursor-pointer"  onClick={()=>handleViewDetails(currentChat)} >
                            <img 
                              src={currentChat.profileImage} 
                              alt="Profile"
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                            />
                            <div className={`${onlineUsers.includes(currentChat._id)?'bg-green-500':'bg-gray-300'} w-3 h-3 rounded-full border border-white absolute top-1 right-0`} />
                          </div>
                          <div>
                            <h2 className="text-white font-semibold text-lg line-clamp-1">
                              {currentChat.userName || currentChat.name}
                            </h2>
                            <p className={`text-sm ${onlineUsers?.includes(currentChat._id)?'text-green-500':'text-gray-300'}`}>
                            {onlineUsers?.includes(currentChat._id) ? (
                                <span>{typingUsers.includes(String(currentChat._id))
                                  ? `Typing${dots}`
                                  : 'Online'}</span>
                                
                              ) : (
                                <LastSeen time={currentChat?.lastSeen} />
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Phone className="w-6 h-6 text-white/70 hover:text-white cursor-pointer transition-colors" />
                          <Video className="w-6 h-6 text-white/70 hover:text-white cursor-pointer transition-colors" />
                          <MoreVertical 
                            className="w-6 h-6 text-white/70 hover:text-white cursor-pointer transition-colors" 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-8 space-y-4 overflow-x-hidden">
                      <Messages currentChat={currentChat} />
                    </div>
                    <ChatInput currentChat={currentChat} />
                  </div>
            )}
          </div>

          {/* Right Sidebar - Desktop */}
<div className={`flex-shrink-0 bg-white/5 border-l border-gray-50/20 
        transition-all duration-300 ease-in-out overflow-y-auto ${
          showRightSidebar ? "w-[25%] opacity-100" : "w-0 opacity-0"
        }`}
        style={{
          transition: "width 300ms ease-in-out, opacity 300ms ease-in-out"
        }}>
 <div className="h-full flex flex-col w-full">
            <div className="px-4 py-5 border-b bg-amber-50/15 border-gray-50/15 flex items-center justify-between">
              <div className="flex items-center">
                <button onClick={closeRightSidebar} className="p-2 mr-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer">
                  <X size={22} />
                </button>
                <h3 className="text-xl font-semibold">{rightSidebarContent}</h3>
              </div>
              <div className="flex space-x-4">
                <Search className="w-6 h-6 text-white/70 hover:text-white cursor-pointer transition-colors" />
                <MoreVertical className="w-6 h-6 text-white/70 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            
            <div className="flex-1">
              {rightSidebarContent === "Group Information" && (
                <GroupInformation
                  currentGroup={currentChat}
                  isCompleted={isCompleted}
                  setIsCompleted={setIsCompleted}
                  currentUser={currentUser}
                  setCurrentPosition={toggleRightSidebar}
                  setCurrentMember={setCurrentMember}
                  onlineUsers={onlineUsers}
                />
              )}
              {rightSidebarContent === "Add Member" && (
                <AddGroupMember
                  currentGroup={currentChat}
                  onlineUsers={onlineUsers}
                />
              )}
              {rightSidebarContent === "Group Members" && (
                <GroupMembers
                  currentGroup={currentChat}
                  currentUser={currentUser}
                  setCurrentPosition={toggleRightSidebar}
                  setCurrentMember={setCurrentMember}
                  onlineUsers={onlineUsers}
                />
              )}
              {rightSidebarContent === "User Information" && (
                <CurrentMemberInfo
                  showChat={showChatWindow}
                  currentMember={currentMember}
                  setCurrentPosition={setCurrentPosition}
                  closeRightSidebar={closeRightSidebar}
                />
              )}
            </div>
          </div>
</div>
        </div>
      </div>
    </>
  );
};

export default Chat;