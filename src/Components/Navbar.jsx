import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({currentPosition, setCurrentPosition,socket,currentUser }) => {
const navigate=useNavigate()

 const logOut = () => {
  console.log(socket);
if (socket) {
  //  socket.emit('disconnectMe',currentUser._id)
   socket.disconnect()
    localStorage.removeItem("current_user");
    navigate("/login");
  };
  };

const changePosition=(name)=>{
setCurrentPosition(name)
}
  return (
    <div className="navb px-4 shadow-sm bg-dark text-white">
      <ul className="d-flex justify-content-between list-unstyled">
        <li className={`${currentPosition==="Chats"?"current":""}`} onClick={()=>changePosition("Chats")}>Chats</li>
        <li className={`${currentPosition==="Contacts"?"current":""}`} onClick={()=>changePosition("Contacts")}>Contacts</li>
        <li className={`${currentPosition==="Groups"?"current":""}`} onClick={()=>changePosition("Groups")}>Groups</li>
        <li className={`${currentPosition==="Profile"?"current":""}`} onClick={()=>changePosition("Profile")}>Profile</li>
        <li onClick={logOut}>Logout</li>
      </ul>
    </div>
  );
};

export default Navbar;
