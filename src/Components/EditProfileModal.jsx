
import React from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { useForm } from "react-hook-form";
import { useUpdateUser } from '../api/authMutation';

const EditProfileModal = ({ currentUser, setEditMode }) => {
  const {mutateAsync:updateUser,isPending:isLoading} = useUpdateUser()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      userName: currentUser?.userName || "",
      email: currentUser?.email || "",
    },
  });

  const closeIt = () => {
    document.querySelector(".comeIn").classList.remove("animate__fadeInDown");
    document.querySelector(".comeIn").classList.add("animate__fadeOutUp");
    setTimeout(() => {
      setEditMode(false);
      document.querySelector(".comeIn").classList.remove("animate__fadeOutUp");
      document.querySelector(".comeIn").classList.add("animate__fadeInDown");
    }, 500);
  };

  const handleSubmitForm = async (data) => {
    try {
      const { data: response } = await updateUser(data);
console.log("response:",response);

      if (response.status) {
        closeIt();
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="comeIn animate__animated animate__fadeInDown w-full max-w-md mx-4">
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="w-full backdrop-blur-3xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8"
        >
          {/* Header */}
          <div className="text-center mb-6 relative">
            <button
              type="button"
              onClick={closeIt}
              className="absolute top-0 right-0 text-white hover:text-gray-200 cursor-pointer transition-colors"
            >
              <MdOutlineClose size={24} />
            </button>
            <h3 className="text-xl md:text-2xl text-white font-bold">
              Edit Profile
            </h3>
          </div>

          {/* Form Content */}
          <div className="space-y-4 z-30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  First Name
                </label>
                <input
                  {...register("firstName", {
                    required: "First name is required",
                    minLength: {
                      value: 3,
                      message: "Must be at least 3 characters",
                    },
                  })}
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border ${
                    errors.firstName 
                      ? "border-rose-400/50 focus:ring-rose-400" 
                      : "border-white/20 focus:border-indigo-300 focus:ring-indigo-300"
                  } text-white placeholder-indigo-200/60 focus:outline-none focus:ring-1 transition-all duration-300`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Last Name
                </label>
                <input
                  {...register("lastName", {
                    required: "Last name is required",
                    minLength: {
                      value: 3,
                      message: "Must be at least 3 characters",
                    },
                  })}
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border ${
                    errors.lastName 
                      ? "border-rose-400/50 focus:ring-rose-400" 
                      : "border-white/20 focus:border-indigo-300 focus:ring-indigo-300"
                  } text-white placeholder-indigo-200/60 focus:outline-none focus:ring-1 transition-all duration-300`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Username
              </label>
              <input
                {...register("userName", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Must be at least 3 characters",
                  },
                })}
                className={`w-full px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border ${
                  errors.userName 
                    ? "border-rose-400/50 focus:ring-rose-400" 
                    : "border-white/20 focus:border-indigo-300 focus:ring-indigo-300"
                } text-white placeholder-indigo-200/60 focus:outline-none focus:ring-1 transition-all duration-300`}
              />
              {errors.userName && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.userName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border ${
                  errors.email 
                    ? "border-rose-400/50 focus:ring-rose-400" 
                    : "border-white/20 focus:border-indigo-300 focus:ring-indigo-300"
                } text-white placeholder-indigo-200/60 focus:outline-none focus:ring-1 transition-all duration-300`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Form Footer */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg shadow bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition duration-300 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </form>
        
        {/* Decorative elements */}
        <div className="absolute top-10 -z-10 left-10 h-16 w-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"></div>
        <div className="absolute bottom-8 -z-10 right-8 h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"></div>
      </div>
    </div>
  );
};

export default EditProfileModal;