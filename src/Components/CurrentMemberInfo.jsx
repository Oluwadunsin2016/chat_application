import React, { useState } from "react";
import ImageView from "./ImageView";
import {
  MessageSquare,
  Image,
  Video,
  Users,
  File,
  Star,
  Phone,
  Mail,
} from "lucide-react";
import { useAuth } from "../contex/authContex";

const CurrentMemberInfo = ({
  currentMember: user,
  showChat,
  setCurrentPosition,
  closeRightSidebar,
}) => {
  const [viewProfilePicture, setViewProfilePicture] = useState(false);
  const [activeTab, setActiveTab] = useState("photos");
  const {handleCurrentChat,handleGroupMode} = useAuth()

  const currentMember = {
    ...user,
    bio: "Digital designer & photography enthusiast. Love traveling and exploring new cultures.",
    location: "Lagos, Nigeria",
    website: "triumphantdesign.com",
    joinedDate: "2023-06-15",
  };
  // Dummy data for media
  const photos = Array(9)
    .fill(0)
    .map((_, i) => `https://picsum.photos/300/300?random=${i + 100}`);
  const videos = Array(4)
    .fill(0)
    .map((_, i) => `https://picsum.photos/300/300?random=${i + 200}`);
  const groups = [
    { name: "Family Group", lastActive: "2h ago" },
    { name: "Work Team", lastActive: "Yesterday" },
    { name: "College Friends", lastActive: "1d ago" },
  ];

  const message = () => {
    handleGroupMode(false);
    handleCurrentChat(currentMember);
    setCurrentPosition("Contacts");
    closeRightSidebar();
    showChat();
  };

  if (!currentMember) return null;

  console.log(photos);
  

  return (
    <div className="h-[90vh] overflow-y-auto flex flex-col">
      {/* Profile Section */}
      <div className="flex flex-col items-center py-6 px-4">
        <div className="relative mb-4">
          <div
            className="w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer"
            onClick={() => setViewProfilePicture(true)}
          >
            <img
              src={currentMember.profileImage}
              alt={currentMember.userName}
              className="w-full h-full align-top object-cover"
            />
          </div>
          <div className="absolute !bottom-4 !right-2 bg-green-500 rounded-full p-2 cursor-pointer">
            <Phone className="text-white w-4 h-4" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-white text-center mb-2">
          {currentMember.firstName} {currentMember.lastName}
        </h2>
        <p className="text-gray-300">
          @{currentMember.userName}
        </p>

        <button
          onClick={message}
          className="mt-4 px-6 py-2 bg-white/40 hover:bg-white text-white hover:text-gray-900 rounded-full flex items-center shadow-md transition-colors cursor-pointer"
        >
          <MessageSquare className="mr-1 w-4 h-4" />
          Message
        </button>
      </div>

      {/* User Details */}
      <div className="space-y-4 px-4 py-4">
        {currentMember?.bio && (
          <div>
            <p className="text-sm text-white/70">Bio</p>
            <p className="font-medium">{currentMember.bio}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-white/70">Location</p>
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {currentMember.location}
          </span>
        </div>
        <div>
          <p className="text-sm text-white/70">Email</p>
          <span className="flex items-center gap-1">
          <Mail size={16} />
            {currentMember.email}
          </span>
        </div>
        <div>
          <p className="text-sm text-white/70">Website</p>
          <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
            {currentMember.website}
          </span>
        </div>
        <span className="flex items-center gap-1 text-sm text-white/70">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Joined on: {" "}
          {currentMember?.createdAt? new Date(currentMember?.createdAt).toLocaleDateString("en-US", {day:'2-digit',
            month: "long",
            year: "numeric",
          }):'N/A'}
        </span>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/20 flex px-4">
        <button
          className={`py-3 px-4 font-medium text-sm cursor-pointer ${
            activeTab === "photos"
              ? "text-white border-b-2 border-white"
              : "text-white/70 transition-colors hover:text-white"
          }`}
          onClick={() => setActiveTab("photos")}
        >
          <div className="flex items-center">
            <Image className="mr-2 w-4 h-4" />
            <span>Photos</span>
          </div>
        </button>
        <button
          className={`py-3 px-4 font-medium text-sm cursor-pointer ${
            activeTab === "videos"
              ? "text-white border-b-2 border-white"
              : "text-white/70 transition-colors hover:text-white"
          }`}
          onClick={() => setActiveTab("videos")}
        >
          <div className="flex items-center">
            <Video className="mr-2 w-4 h-4" />
            <span>Videos</span>
          </div>
        </button>
        <button
          className={`py-3 px-4 font-medium text-sm cursor-pointer ${
            activeTab === "groups"
              ? "text-white border-b-2 border-white"
              : "text-white/70 transition-colors hover:text-white"
          }`}
          onClick={() => setActiveTab("groups")}
        >
          <div className="flex items-center">
            <Users className="mr-2 w-4 h-4" />
            <span>Groups</span>
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "photos" && (
          <div>
            <h4 className="text-white/70 text-sm mb-4">
              {photos.length} photos
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((photo, index) => (
                <div key={index} className="aspect-square">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "videos" && (
          <div>
            <h4 className="text-white/70 text-sm mb-4">
              {videos?.length} videos
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {videos?.map((video, index) => (
                <div key={index}>
                  <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={video}
                      alt={`Video ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-white opacity-80"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-white">Video {index + 1}</p>
                  <p className="text-xs text-white/70">2 days ago</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "groups" && (
          <div>
            <h4 className="text-white/70 text-sm mb-4">
              {groups.length} groups in common
            </h4>
            <div className="space-y-4">
              {groups.map((group, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 hover:bg-white/30 rounded-lg cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-white/40 flex items-center justify-center mr-3">
                    <Users className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{group.name}</p>
                    <p className="text-sm text-white/70">
                      Last active: {group.lastActive}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Starred Messages */}
      <div className="p-4 border-t border-white/20">
        <button className="flex items-center w-full py-2">
          <Star className="mr-3 text-white/70 w-5 h-5" />
          <span>Starred Messages</span>
        </button>
      </div>

      {/* Media, Docs and Links */}
      <div className="p-4 border-t border-white/20">
        <button className="flex items-center w-full py-2">
          <File className="mr-3 text-white/70 w-5 h-5" />
          <span>Media, Docs and Links</span>
        </button>
      </div>

      {/* Image View Modal */}
      {viewProfilePicture && (
        <ImageView
          setViewProfilePicture={setViewProfilePicture}
          currentUser={currentMember}
        />
      )}
    </div>
  );
};

export default CurrentMemberInfo;
