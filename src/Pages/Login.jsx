import React, { useState } from "react";
import { BsFillChatFill, BsEye, BsEyeSlash } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
// import { io } from "socket.io-client";
import { setToast } from "../Components/Toast/toastUtils";
import { useLogin } from "../api/authMutation.js";
import AuthBackground from "../Components/shared/AuthBackground.jsx";
// import { host } from "../api/http.js";

const Login = () => {
  const navigate = useNavigate();
  const { mutateAsync: loginUser, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userName: "",
      password: ""
    },
  });

  const onSubmit = async (data) => {
    try {
      const { data: response } = await loginUser({
        userName: data.userName,
        password: data.password
      });
console.log(response);

      if (response.status) {
        setToast("success", "Logged in successfully");
        localStorage.setItem("chatToken", response.token);
        navigate("/");
      } else {
        setToast("error", response.message);
      }
    } catch (error) {
      setToast("error", error.message || "Login failed");
    }
  };

  return (
    <AuthBackground >
   <div className="flex items-center justify-center h-screen p-6">
          <div className="w-full max-w-xl backdrop-blur-3xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8">
            {/* Header Section */}
            <div className="text-center mb-4 z-30">
              {/* <div className="flex justify-center mb-4">
                <BsFillChatFill className="text-white text-4xl" />
              </div> */}
              <h1 className="text-xl md:text-2xl text-white font-bold">Let's Discuss</h1>
              <p className="text-indigo-200 tracking-wider mt-2 font-medium">Welcome back</p>
            </div>

            {/* Form Section */}
            <form 
              onSubmit={handleSubmit(onSubmit)} 
              className="space-y-6 z-30"
              noValidate
            >
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
                  })}
                />
                {errors.userName && (
                  <p className="mt-1 text-sm text-red-600">{errors.userName.message}</p>
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

              <button
                type="submit"
                disabled={isPending}
                className={`w-full py-3 px-4 rounded-lg shadow bg-indigo-500 hover:bg-indigo-600 cursor-pointer text-white font-semibold transition duration-300 ${
                  isPending ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>

              <div className="text-center text-sm text-gray-200 mt-4">
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300 underline">
                  Register here
                </Link>
              </div>
            </form>
        <div className="absolute top-10 -z-10 left-10 h-16 w-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"></div>
        <div className="absolute bottom-8 -z-10 right-8 h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"></div>
          </div>

   </div>
    </AuthBackground>
  );
};

export default Login;