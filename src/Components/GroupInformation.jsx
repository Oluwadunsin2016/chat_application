/* eslint-disable no-unused-vars */
import React, { useMemo } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { BsCamera, BsImages } from "react-icons/bs";
import groupImg from "../assets/groupImage.png";
import Camera from "./Camera";
import CircularProgressBar from "./CircularProgressBar";
import { CompletedSign } from "./CompletedSign";
import ImageView from "./ImageView";
import { useRef } from "react";
import { LoaderCircle, Pencil, Camera as LucideCamera, Search, Trash2 } from "lucide-react";
import { useGetMembers } from "../api/groupMutation";
import http from "../api/http";
import GroupEditModal from "./GroupEditModal";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contex/authContex";
import DeleteMemberModal from "./DeleteMemberModal"; // Import the modal

const GroupInformation = ({
  currentGroup,
  currentUser,
  isCompleted,
  setIsCompleted,
  setCurrentPosition,
  setCurrentMember,
  onlineUsers
}) => {
  const [file, setFile] = useState("");
  const [pictureChangeMode, setpictureChangeMode] = useState(false);
  const [isuploading, setIsUploading] = useState(false);
  const [takePicture, setTakePicture] = useState(false);
  const [viewProfilePicture, setViewProfilePicture] = useState(false);
  const [groupEditMode, setGroupEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [memberToDelete, setMemberToDelete] = useState(null); // State for member to delete
  const {handleCurrentChat} = useAuth()
   const {data:data, isLoading} = useGetMembers(currentGroup?._id)
  const dropdownRef = useRef(null);
  const querClient=useQueryClient()
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setpictureChangeMode(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const availableMembers= useMemo(() => {
    return data?.members?.filter(info =>
      info?.member?.userName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      info?.member?.email?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      info?.member?.firstName?.toLowerCase().includes(searchTerm?.toLowerCase())||
      info?.member?.lastName?.toLowerCase().includes(searchTerm?.toLowerCase())
    );
  },[data,searchTerm]);
 

  const openClose = () => {
    setpictureChangeMode(!pictureChangeMode);
  };

  useEffect(() => {
    if (file !== "") {
      uploadFile();
    }
  }, [file]);

  const getFile = (e) => {
    const myFile = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(myFile);
    reader.onload = () => {
      setFile(reader.result);
    };
  };

  const uploadFile = () => {
    http
      .post(
        '/group/upload',
        {
          file,
          id: currentGroup?._id,
        },
        {
          onUploadProgress: (data) => {
            console.log(data.bytes, data.progress, data.total);
          },
        }
      )
      .then((data) => {
        if (data.data.success) {
          setIsUploading(true);
          console.log(data.data.message);
          console.log('updateGroup:', data?.data?.group);
          
          handleCurrentChat(data.data.group);
          querClient.invalidateQueries(['groups'])
          setFile("");
        } else {
          console.log(data.data.message);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const viewMemberDetails = (member) => {
    if (currentUser._id != member._id) {
      setCurrentMember(member);
      setCurrentPosition("User Information",);
    }
  };

  const period=useMemo(()=>{
    const dateObj = new Date(currentGroup?.createdAt);

   const createdDate = dateObj.toLocaleDateString("en-US", {day:'2-digit',
      month: "long",
      year: "numeric",
    })

    const timeIn12Hrs = dateObj.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });


  return {time:timeIn12Hrs, date:createdDate}
  },[currentGroup])

  const isAdmin = currentUser._id === currentGroup?.admin?._id;

  return (
    <div className="h-[90vh] overflow-y-auto">
      {/* Delete Member Modal */}
      <DeleteMemberModal
        isOpen={!!memberToDelete}
        onOpenChange={(isOpen) => {
          if (!isOpen) setMemberToDelete(null);
        }}
        onCancel={() => setMemberToDelete(null)}
        memberToDelete={memberToDelete}
        currentGroup={currentGroup}
      />

      <div className="">
        <div className=" text-white mb-5">
          <div className="h-44 w-44 mx-auto !my-4 relative !z-0">
            <div className="relative w-full h-full rounded-full cursor-pointer overflow-hidden border-4 border-white/80">
              <img
                onClick={() => setViewProfilePicture(true)}
                src={currentGroup?.profileImage}
                alt=""
                className="w-full h-full object-cover object-top"
              />
                 {isuploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      {isCompleted ? (
                        <CompletedSign
                          setIsUploading={setIsUploading}
                          setIsCompleted={setIsCompleted}
                        />
                      ) : (
                        <CircularProgressBar
                          setIsCompleted={setIsCompleted}
                          isuploading={isuploading}
                        />
                      )}
                    </div>
                  )}
            </div>

            {currentUser._id == currentGroup?.admin?._id && (
              <div ref={dropdownRef} className="relative">
                <div className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 absolute !bottom-3 !right-2 cursor-pointer" onClick={openClose}>
                <LucideCamera className="size-5" />
                </div>
                      <div className={`absolute border border-white/40 top-full !left-1/2 transform -translate-x-1/2 mt-4 bg-white/20 backdrop-blur-lg rounded-xl p-3 shadow-lg    transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${pictureChangeMode 
                                                      ? 'opacity-100 translate-y-0 visible' 
                                                      : 'opacity-0 -translate-y-4 invisible'}`}>
                                  <div className="flex gap-4">
                                    <button
                                      onClick={() => setTakePicture(true)}
                                      className="flex flex-col items-center justify-center !gap-2 p-3 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 transition-colors cursor-pointer"
                                    >
                                      <BsCamera className="text-2xl" />
                                      <span className="text-xs">Camera</span>
                                    </button>
                                    
                                    <label className="flex flex-col items-center justify-center !gap-2 p-3 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 transition-colors cursor-pointer">
                                      <BsImages className="text-2xl" />
                                      <span className="text-xs">Gallery</span>
                                      <input
                                        type="file"
                                        onChange={getFile}
                                        className="hidden"
                                        accept="image/*"
                                      />
                                    </label>
                                  </div>
                                </div>
                                
             
              </div>
            )}
          </div>
      <div className="px-4 py-2">
         <div className="flex justify-between gap-4 items-center mb-3 border-b border-white/20">
                      <h2 className="text-lg font-bold">
                        {currentGroup?.name}
                      </h2>
                    {currentUser?._id == currentGroup?.admin?._id &&  <button 
                        onClick={() => setGroupEditMode(true)}
                        className="rounded-full p-2 cursor-pointer hover:bg-white/20 transition-colors"
                      >
                        <Pencil size={16} />
                      </button>}
                    </div>

           <div className="space-y-4">
           <div>
            <p className=" text-white/70">Description</p>
            <p className="text-sm">{currentGroup?.description || 'No description'}</p>
          </div>
           <div>
            <p className=" text-white/70">Date created</p>
            <p className="text-sm">{period.date}</p>
          </div>
           <div>
            <p className=" text-white/70">Time</p>
            <p className="text-sm">{period.time}</p>
          </div>
           </div>
      </div>
        </div>
                  <div className="flex items-center justify-between gap-6 px-4 mt-4">
        <h5 className="text-white text-lg font-bold flex-1">Group members</h5>
        {availableMembers?.length>0 && <div className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-white">{availableMembers?.length}</span>
                  </div>}
                  </div>
                  <div className="!relative px-3 !my-4">
                      <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                      <input
                        type="text"
                        value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search contacts..."
                        className="w-full bg-white/20 border border-white/30 rounded-xl py-2 !pl-10 pr-4 text-sm md:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                      />
                    </div>
     <div className="space-y-4 px-4 mt-4">
       {isLoading ? (
             <div className="flex items-center justify-center mt-12">
             <LoaderCircle size={30} className="animate-spin" />
          </div> 
            ) : (
              <div className="space-y-4 !my-4">
          {availableMembers&&[...availableMembers]
        ?.sort((a, b) => {
          if (a.member._id === currentGroup?.admin._id) return -1;
          if (b.member._id === currentGroup?.admin._id) return 1;
          return 0;
        })
        ?.map((info) => {
          return (
            <div
              className={`bg-white/10 flex items-center gap-4 p-2 rounded-lg
                transition-colors duration-300 ease-in-out
                ${currentUser?._id === info?.member?._id? "cursor-not-allowed":"cursor-pointer hover:bg-white/20" }`}
              key={info.member._id}
            >
              <div 
                className="w-[3rem] h-[3rem] flex-none relative"
                onClick={() => viewMemberDetails(info.member)}
              >
                <img
                  src={info.member.profileImage}
                  alt="picture"
                  className="w-full h-full object-cover rounded-full object-top"
                />
                <div className={`${onlineUsers?.includes(info?.member?._id) ? 'bg-green-500' : 'bg-gray-300'} w-3 h-3 rounded-full border border-white absolute top-1 right-0`} />
              </div>
              <div 
                className="username text-white w-full flex items-center justify-between"
                onClick={() => viewMemberDetails(info.member)}
              >
                <div>
                  {info.member._id === currentGroup?.admin._id ? (
                    <div className="flex items-center gap-2">
                      <h5>{info.member.userName}</h5>
                      <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full">
                        admin
                      </span>
                    </div>
                  ) : (
                    <h5>{info.member.userName}</h5>
                  )}
                </div>
                
                {/* Delete button for admin on non-admin members */}
                {isAdmin && 
                  info.member._id !== currentGroup?.admin._id && 
                  info.member._id !== currentUser._id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMemberToDelete(info.member);
                      }}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-full transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
              </div>
            </div>
          );
        })}
              </div>
            )}
     </div>
      </div>
      {takePicture && (
        <Camera setTakePicture={setTakePicture} setFile={setFile} />
      )}
      {viewProfilePicture && (
        <ImageView
          setViewProfilePicture={setViewProfilePicture}
          profile={groupImg}
          currentUser={currentGroup}
        />
      )}
          <GroupEditModal 
          group={currentGroup}
              isOpen={groupEditMode}
              onClose={() => setGroupEditMode(false)}
            />
    </div>
  );
};

export default GroupInformation;