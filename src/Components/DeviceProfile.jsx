
import React, { useEffect, useRef, useState } from 'react';
import { BsCamera, BsImages } from 'react-icons/bs';
import Camera from './Camera';
import CircularProgressBar from './CircularProgressBar';
import { CompletedSign } from './CompletedSign';
import EditProfileModal from './EditProfileModal';
import ImageView from './ImageView';
import { Image, Lock, Pencil, Video, Camera as LucideCamera } from 'lucide-react';
import { Button } from '@heroui/react';
import { useAuth } from '../contex/authContex';
import { useUploadProfileImage } from '../api/authMutation';

const DeviceProfile = ({
  isCompleted,
  setIsCompleted,
}) => {
  const [file, setFile] = useState("");
  const [pictureChangeMode, setpictureChangeMode] = useState(false);
  const [isuploading, setIsUploading] = useState(false);
  const [takePicture, setTakePicture] = useState(false);
  const [viewProfilePicture, setViewProfilePicture] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('photos');
  const dropdownRef = useRef(null);
  const { authUser:user } = useAuth();
  const {mutateAsync:uploadImage}= useUploadProfileImage()
    // Dummy data for media
    const photos = Array(9).fill(0).map((_, i) => `https://picsum.photos/300/300?random=${i+100}`);
    const videos = Array(4).fill(0).map((_, i) => `https://picsum.photos/300/300?random=${i+200}`);

  const currentUser={...user,
    bio: "Digital designer & photography enthusiast. Love traveling and exploring new cultures.",
    location: "Lagos, Nigeria",
    website: "triumphantdesign.com",
    joinedDate: "2023-06-15",}

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setpictureChangeMode(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const uploadFile = async() => {
  try {
    await uploadImage(
      {
        file,
      }
    )
    setIsUploading(true);
    setFile("");
  } catch (error) {
    console.log(error)
  }
    
  };

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto">
        <h3 className="text-2xl font-bold text-center">Your Profile</h3>
        
        <div className="overflow-hidden">
          {/* Profile Header */}
          <div className="relative">
            {/* Profile Picture */}
            <div className="flex justify-center py-6">
              <div ref={dropdownRef} className="relative group">
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white/80 cursor-pointer">
                  <img
                    onClick={() => setViewProfilePicture(true)}
                    src={currentUser?.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
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
                
                {/* Camera Button */}
                <button
                  onClick={openClose}
                  className="absolute !bottom-2 !right-2 bg-blue-500 hover:bg-blue-600 text-white  p-2 rounded-full cursor-pointer transition-all transform"
                >
                  <LucideCamera className="size-5" />
                </button>
              <div className={`absolute border border-white/40 top-full !left-1/2 transform -translate-x-1/2 mt-4 bg-white/20 backdrop-blur-lg rounded-xl p-3 shadow-lg !z-10 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${pictureChangeMode 
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
            </div>
          </div>
          
          {/* Profile Information */}
          <div className="px-3 py-4">
            <div className="space-y-4">
              <div className="flex justify-between gap-4 items-center pb-3 border-b border-white/40">
                <h2 className="text-lg font-bold">
                  {currentUser?.firstName} {currentUser?.lastName}
                </h2>
                <button 
                  onClick={() => setEditMode(true)}
                  className="rounded-full p-2 cursor-pointer hover:bg-white/20 transition-colors"
                >
                  <Pencil size={16} />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-white/70">Username</p>
                  <p className="font-medium">{currentUser?.userName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-white/70">Email</p>
                  <p className="font-medium">{currentUser?.email}</p>
                </div>
                
                {currentUser?.bio && (
                  <div>
                    <p className="text-sm text-white/70">Bio</p>
                    <p className="font-medium">{currentUser.bio}</p>
                  </div>
                )}
  <div>
                  <p className="text-sm text-white/70">Location</p>
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {currentUser.location}
                  </span>
                </div>
  <div>
                  <p className="text-sm text-white/70">Website</p>
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {currentUser.website}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-sm text-white/70">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Joined on: {currentUser?.createdAt?new Date(currentUser?.createdAt).toLocaleDateString('en-US', { day:'2-digit', month: 'long', year: 'numeric' }):'N/A'}
                  </span>
              </div>
            </div>
    
            {/* <div className="mt-4 flex justify-center space-x-3">
            <button className="flex items-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-1 text-sm rounded-full transition-colors">
                    <Lock size={16} />
                    Change Password
                  </button>
                  <Button startContent={<Lock size={16} />}> Change Password</Button>
                  <Button color='primary' startContent={<Pencil size={16} />}>  Edit Profile</Button>
                  <button 
                    onClick={() => setEditMode(true)}
                    className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 text-sm rounded-full transition-colors"
                  >
                    <Pencil size={16} className="mr-2" />
                    Edit Profile
                  </button>
                </div> */}
          </div>
          

 {/* Tabs */}
 <div className="border-b border-white/20 flex px-4">
        <button 
          className={`py-3 px-4 font-medium text-sm cursor-pointer ${activeTab === 'photos' ? 'text-white border-b-2 border-white' : 'text-white/70 transition-colors hover:text-white'}`}
          onClick={() => setActiveTab('photos')}
        >
          <div className="flex items-center">
            <Image className="mr-2 w-4 h-4" />
            <span>Photos</span>
          </div>
        </button>
        <button 
          className={`py-3 px-4 font-medium text-sm cursor-pointer ${activeTab === 'videos' ? 'text-white border-b-2 border-white' : 'text-white/70 transition-colors hover:text-white'}`}
          onClick={() => setActiveTab('videos')}
        >
          <div className="flex items-center">
            <Video className="mr-2 w-4 h-4" />
            <span>Videos</span>
          </div>
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'photos' && (
          <div>
            <h4 className="text-white/70 text-sm mb-4">{photos.length} photos</h4>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((photo, index) => (
                <div key={index} className="aspect-square">
                  <img 
                    src={photo} 
                    alt={`Photo ${index+1}`} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'videos' && (
          <div>
            <h4 className="text-white/70 text-sm mb-4">{videos.length} videos</h4>
            <div className="grid grid-cols-2 gap-4">
              {videos.map((video, index) => (
                <div key={index}>
                  <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={video} 
                      alt={`Video ${index+1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center ">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white opacity-80" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-white">Video {index+1}</p>
                  <p className="text-xs text-white/70">2 days ago</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
    
      </div>

  

        </div>
      </div>
      
      {/* Modals */}
      {takePicture && (
        <Camera setTakePicture={setTakePicture} setFile={setFile} />
      )}
      
      {viewProfilePicture && (
        <ImageView
          setViewProfilePicture={setViewProfilePicture}
          currentUser={currentUser}
        />
      )}
      
      {editMode && (
        <EditProfileModal 
          currentUser={currentUser} 
          setEditMode={setEditMode}
        />
      )}
    </div>
  );
};

export default DeviceProfile;
