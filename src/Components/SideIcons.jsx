import React from "react";
import { Tooltip } from "@heroui/react";
import { CircleUserRound, ContactRound, LogOut, MessageCircle, UsersRound } from "lucide-react";
import { useAuth } from "../contex/authContex";

const SideIcons = ({ currentPosition, setCurrentPosition, }) => {
  const { authUser:currentUser, logout } = useAuth();

const changePosition=(name)=>{
setCurrentPosition(name)
console.log(name," selected");
}

const sections=[
  {
    name:"Chats", icon:MessageCircle,
},
  {
    name:"Contacts", icon:ContactRound,
},
  {
    name:"Groups", icon:UsersRound,
},
]

  return (
    <>
      {currentUser && (
        <div>
          <div className="hidden md:flex flex-col justify-between h-screen w-14 py-5 border-r bg-amber-50/15 border-gray-50/15">
          <div className="flex flex-col gap-2">
            {sections.map((section,i)=>(
              <div key={i} onClick={()=>changePosition(section.name)} className={`${currentPosition===section.name&&"bg-white/40"} py-2 flex !items-center justify-center mx-1 rounded-lg`}>
            <Tooltip showArrow={true} content={section.name} placement="right">
          <section.icon color="white" className="cursor-pointer outline-none" />
          </Tooltip>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-4">
            <div id="Profile">
              <div className="w-[2.2rem] h-[2.2rem] rounded-full overflow-hidden cursor-pointer" onClick={()=>changePosition('Profile')} >
              <Tooltip showArrow={true} content="Profile" placement="right">
              <img
                  src={currentUser.profileImage}
                  className="w-full h-full object-cover"
                  alt="picture"
                />
              </Tooltip>
              </div>
            </div>
              <button className="logout cursor-pointer" onClick={logout}>
                {/* <MdOutlineLogout /> */}
                <Tooltip content="Logout" placement="right">
                <LogOut color="white" />
                </Tooltip>
              </button>
   
          </div>
        </div>

        <div className=" flex md:hidden items-center gap-6 justify-center px-5 py-2 bg-amber-50/15 rounded-t-lg">
            {sections.map((section,i)=>(
              <div key={i} onClick={()=>changePosition(section.name)} className={`${currentPosition===section.name&&"bg-white/40"} p-2 flex !items-center justify-center rounded-lg`}>
            <Tooltip showArrow={true} content={section.name} placement="top">
          <section.icon size={18} color="white" className="cursor-pointer outline-none" />
          </Tooltip>
              </div>
            ))}
              {/* <div className="cursor-pointer" onClick={open}> */}
              <div onClick={()=>changePosition('Profile')} className={`${currentPosition==='Profile'&&"bg-white/40"} p-2 flex !items-center justify-center rounded-lg`}>
              <Tooltip showArrow={true} content="Profile" placement="top">
              <CircleUserRound size={18} color="white" className="cursor-pointer outline-none" />
              </Tooltip>
              </div>
              <button className="logout cursor-pointer" onClick={logout}>
                {/* <MdOutlineLogout /> */}
                <Tooltip showArrow={true} content="Logout" placement="top">
                <LogOut size={18} color="white" />
                </Tooltip>
              </button>
        </div>
        </div>
      )}
    </>
  );
};

export default SideIcons;
