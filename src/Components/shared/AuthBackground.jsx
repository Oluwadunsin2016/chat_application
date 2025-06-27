import React from 'react'

const AuthBackground = ({children}) => {
  return (
    <div className="h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 backdrop-blur-3xl text-white overflow-hidden relative">
    <div className="hidden md:block absolute  h-[80rem] w-[80rem] -left-[30rem] -top-[2rem] -z-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"></div>
   <div className="absolute -top-10 -right-10 h-[10rem] w-[10rem] -z-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"></div>
   <div className="md:hidden absolute -bottom-80 -left-[30rem] h-[50rem] w-[50rem] -z-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"></div>
  {children}
 </div>
  )
}

export default AuthBackground