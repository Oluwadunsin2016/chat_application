import React, { useEffect, useState } from "react";
import { BsFillChatFill, BsEye, BsEyeSlash } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { io } from "socket.io-client";
import { setToast } from "../Components/Toast/toastUtils";
import { host } from "../api/http.js";
import { useRegister } from "../api/authMutation.js";
import AuthBackground from "../Components/shared/AuthBackground.jsx";

const Register = () => {
  const navigate = useNavigate();
  const { mutateAsync: registerUser, isPending } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // useEffect(() => {
  //   if (localStorage.current_user) {
  //     navigate("/");
  //   }
  // }, [navigate]);

  const onSubmit = async (data) => {
    try {
      const { data: response } = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.userName,
        email: data.email,
        password: data.password,
      });
console.log("response:", response);

      if (response.status) {
        setToast("success", "Registration successful");
        localStorage.setItem("chatToken", response.token);
        navigate("/");
      } else {
        setToast("error", response.message);
      }
    } catch (error) {
      setToast("error", error.message || "Registration failed");
    }
  };

  return (
    <AuthBackground>   
      <div className="overflow-auto h-screen p-6">
          <div className="w-full mx-auto max-w-xl backdrop-blur-3xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden md:mt-4 p-6 md:p-8 relative">
            {/* Header Section */}
            <div className="text-center mb-4">
              {/* <div className="flex justify-center mb-4">
                <BsFillChatFill className="text-white text-4xl" />
              </div> */}
              <h1 className="text-xl md:text-2xl font-bold">Let's Discuss</h1>
              <p className="text-indigo-200 tracking-wider mt-2 font-medium">Create an account</p>
            </div>

            {/* Form Section */}
            <form 
              onSubmit={handleSubmit(onSubmit)} 
              className="space-y-6"
              noValidate
            >
              <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-200 mb-1">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className={`w-full px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border ${
                      errors.firstName ? "border-rose-400/50 focus:ring-rose-400" 
                        : "border-white/20 focus:border-indigo-300 focus:ring-indigo-300"
                    } text-white placeholder-indigo-200/60 focus:outline-none focus:ring-1 transition-all duration-300`}
                    placeholder="John"
                    {...register("firstName", {
                      required: "First name is required",
                      minLength: {
                        value: 3,
                        message: "First name must be at least 3 characters",
                      },
                      maxLength: {
                        value: 20,
                        message: "First name cannot exceed 20 characters",
                      },
                    })}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-200 mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className={`w-full px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border ${
                      errors.lastName ? "border-rose-400/50 focus:ring-rose-400" 
                        : "border-white/20 focus:border-indigo-300 focus:ring-indigo-300"
                    } text-white placeholder-indigo-200/60 focus:outline-none focus:ring-1 transition-all duration-300`}
                    placeholder="Doe"
                    {...register("lastName", {
                      required: "Last name is required",
                      minLength: {
                        value: 3,
                        message: "Last name must be at least 3 characters",
                      },
                      maxLength: {
                        value: 20,
                        message: "Last name cannot exceed 20 characters",
                      },
                    })}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-200 mb-1">
                  Username
                </label>
                <input
                  id="userName"
                  type="text"
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border ${
                    errors.userName ? "border-rose-400/50 focus:ring-rose-400" 
                        : "border-white/20 focus:border-indigo-300 focus:ring-indigo-300"
                    } text-white placeholder-indigo-200/60 focus:outline-none focus:ring-1 transition-all duration-300`}
                  placeholder="johndoe123"
                  {...register("userName", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                    maxLength: {
                      value: 15,
                      message: "Username cannot exceed 15 characters",
                    },
                  })}
                />
                {errors.userName && (
                  <p className="mt-1 text-sm text-red-600">{errors.userName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border ${
                    errors.email ? "border-rose-400/50 focus:ring-rose-400" 
                        : "border-white/20 focus:border-indigo-300 focus:ring-indigo-300"
                    } text-white placeholder-indigo-200/60 focus:outline-none focus:ring-1 transition-all duration-300`}
                  placeholder="john@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border ${
                    errors.password ? "border-rose-400/50 focus:ring-rose-400" 
                        : "border-white/20 focus:border-indigo-300 focus:ring-indigo-300"
                    } text-white placeholder-indigo-200/60 focus:outline-none focus:ring-1 transition-all duration-300`}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 5,
                      message: "Password must be at least 5 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-300 hover:text-gray-200 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border ${
                    errors.confirmPassword ? "border-rose-400/50 focus:ring-rose-400" 
                        : "border-white/20 focus:border-indigo-300 focus:ring-indigo-300"
                    } text-white placeholder-indigo-200/60 focus:outline-none focus:ring-1 transition-all duration-300`}
                  placeholder="••••••••"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-300 hover:text-gray-200 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
                </button>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className={`w-full py-3 px-4 rounded-lg shadow bg-indigo-500 hover:bg-indigo-600 cursor-pointer text-white font-semibold transition duration-300 ${
                  isPending ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isPending ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="text-center text-sm text-gray-200 mt-4">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300 underline">
                  Login here
                </Link>
              </div>
            </form>
            <div className="absolute top-10 left-10 h-16 w-16 -z-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"></div>
            <div className="absolute bottom-8 -z-10 right-8 h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"></div>
          </div>
      </div>
    </AuthBackground>
  );
};

export default Register;