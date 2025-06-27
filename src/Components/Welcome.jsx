import React from "react";
import robot from '../assets/robot.gif'

const Welcome = ({currentUser}) => {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-white">
      <img height={200} width={200} src={robot} alt="robot" />
      <h2 className="text-2xl md:text-3xl">
        Welcome, <span className="text-green-400">{currentUser?.userName}!</span>
      </h2>
      <h4>Please, select a chat to start messaging</h4>
    </div>
  );
};

export default Welcome;
