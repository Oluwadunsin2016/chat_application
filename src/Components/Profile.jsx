import React, { useEffect, useState } from "react";
import { HiOutlineCamera } from "react-icons/hi";
import { MdOutlineClose } from "react-icons/md";
import { BsImages, BsCamera } from "react-icons/bs";
import axios from "axios";
import { fileUploadRoute } from "../Utils/APIRoutes";
import CircularProgressBar from "./CircularProgressBar";
import { CompletedSign } from "./CompletedSign";
import Camera from "./Camera";
import ImageView from "./ImageView";
import "animate.css"
import { AiFillEdit } from "react-icons/ai";
import EditProfileModal from "./EditProfileModal";

const Profile = ({
  close,
  currentUser,
  setIsProfilePictureSet,
  isCompleted,
  setIsCompleted,
  setcurrentUser
}) => {
  const [file, setFile] = useState("");
  const [pictureChangeMode, setpictureChangeMode] = useState(false);
  const [isuploading, setIsUploading] = useState(false);
  const [takePicture, setTakePicture] = useState(false);
  const [viewProfilePicture, setViewProfilePicture] = useState(false);
  const [editMode, setEditMode] = useState(false)

  const openClose = () => {
    setpictureChangeMode(!pictureChangeMode);
  };

  useEffect(() => {
    if (file !== "") {
      uploadFile();
    }
  }, [file]);

// console.log(currentUser);
  const getFile = (e) => {
    const myFile = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(myFile);
    reader.onload = () => {
      setFile(reader.result);
    };
  };

  const uploadFile = () => {
    axios
      .post(
        fileUploadRoute,
        {
          file,
          id: currentUser._id,
        },
        {
          onUploadProgress: (data) => {
            console.log(data.bytes, data.progress, data.total);
          },
        }
      )
      .then((data) => {
        if (data.data.status) {
          setIsUploading(true);
          console.log(data.data.message);
          localStorage.setItem("current_user", JSON.stringify(data.data.user));
          setIsProfilePictureSet(true);
          setFile("");
        } else {
          console.log(data.data.message);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const closeIt = () => {
    document.querySelector(".animation").classList.remove("animate__fadeInBottomLeft");
    document.querySelector(".animation").classList.add("animate__fadeOutBottomLeft");
   setTimeout(()=>{
    close();
    document.querySelector(".animation").classList.remove("animate__fadeOutBottomLeft");
    document.querySelector(".animation").classList.add("animate__fadeInBottomLeft");
   },1000)
  };

  return (
    <div className="">
      <div className="animation animate__animated animate__fadeInBottomLeft">
        {currentUser && (
          <div className="profile text-white bg-dark col-md-6 col-12 col-md-8 col-lg-6 px-md-2 px-5 py-2">
            <div className="close" onClick={closeIt}>
              <MdOutlineClose />
            </div>
            <div className="cover my-5">
              <div className="image">
                <img
                  onClick={() => setViewProfilePicture(true)}
                  src={currentUser.profileImage}
                  alt=""
                />
              </div>
              <div className="camera" onClick={openClose}>
                <HiOutlineCamera />
              </div>
              {isuploading && (
                <div className="uploading">
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
              {pictureChangeMode && (
                <div className="gallery">
                  <div
                    className="get-picture"
                    onClick={() => setTakePicture(true)}
                  >
                    <BsCamera />
                  </div>
                  <div className="get-picture">
                    <BsImages />
                    <input
                      className=""
                      type="file"
                      onChange={getFile}
                      name=""
                      id=""
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="mx-md-5">
              <h4>
                <span>Name:</span> {currentUser.firstName} {currentUser.lastName}
              </h4>
              <h5>
                <span>Username:</span> {currentUser.userName}
              </h5>
              <h6>
                <span>Email: </span>
                {currentUser.email}
              </h6>
              <button type="submit" className="profileEdit float-end" onClick={()=>setEditMode(true)}><AiFillEdit size={30}/></button>
            
            </div>
          </div>
        )}
      </div>
        {takePicture && (
          <Camera setTakePicture={setTakePicture} setFile={setFile} />
        )}
        {viewProfilePicture && (
          <ImageView
            setViewProfilePicture={setViewProfilePicture}
            currentUser={currentUser}
          />
        )}
        {editMode && <EditProfileModal setcurrentUser={setcurrentUser} currentUser={currentUser} setEditMode={setEditMode}/>}
    </div>
  );
};

export default Profile;
