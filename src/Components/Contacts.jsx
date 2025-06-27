import { LoaderCircle, Search, Settings } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useGetAllUsers } from "../api/authMutation";
import { useAuth } from "../contex/authContex";

const Contacts = ({showChat, onlineUsers }) => {
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const {data:users, isFetching:isLoading} = useGetAllUsers()
  const [searchTerm, setSearchTerm] = useState('');
  console.log("users:",users);
  const {handleCurrentChat,handleGroupMode}= useAuth()
  

const changeCurrentChat=(contact,id)=>{
setCurrentSelected(id)
handleCurrentChat(contact)
handleGroupMode(false)
showChat()
}

const contacts= useMemo(() => {
  return users?.data?.filter(contact =>
    contact?.userName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    contact?.email?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    contact?.firstName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    contact?.lastName?.toLowerCase().includes(searchTerm?.toLowerCase()) 
  );
},[users,searchTerm]);



  return (
    <div className="">
      <div className="p-4 md:p-6 border-b border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
          Contacts
          </h1>
          <Settings className="w-5 h-5 md:w-6 md:h-6 text-white/70 hover:text-white cursor-pointer transition-colors" />
        </div>
        
        {/* Search */}
        <div className="!relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full bg-white/20 border border-white/30 rounded-xl py-2 md:py-3 !pl-10 pr-4 text-sm md:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
          />
        </div>
      </div>
        {isLoading? <div className="flex items-center justify-center mt-12">
                <LoaderCircle size={30} className="animate-spin" />
             </div> 
       :
       <div className="space-y-6 overflow-y-auto h-[75vh] px-5 mt-4">
         {contacts.length == 0 ? (
            <div className="text-white text-center">
              <h5>No user found!</h5>
            </div>
          ) : (
       contacts?.map((contact) => {
         return (
           <div
             className={`bg-white/10 cursor-pointer flex items-center gap-4 p-2 rounded-lg
               transition-colors duration-300 ease-in-out
               hover:bg-white/20
               ${currentSelected === contact._id && "bg-white/15"}`}
             key={contact._id}
             onClick={() => changeCurrentChat(contact, contact._id)}
           >
             <div className="w-[3rem] h-[3rem] rounded-full relative">
               <img
                 src={contact.profileImage}
                 alt="picture"
                 className="w-full h-full object-cover rounded-full object-top"
               />
               <div className={`${onlineUsers?.includes(contact._id) ? 'bg-green-500' : 'bg-gray-300'} w-3 h-3 rounded-full border border-white absolute top-1 right-0`} />
             </div>
             <div className="username text-white">
               <h4>{contact.userName}</h4>
             </div>
           </div>
         );
       })
      )}
     </div>
}
    </div>
  );
};

export default Contacts;
