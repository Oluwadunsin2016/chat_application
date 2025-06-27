
import React, { useMemo, useState } from "react";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import { LoaderCircle, Plus, Search, Settings } from "lucide-react";
import GroupCreationModal from "./GroupCreationModal";
import { useGetGroups } from "../api/groupMutation";
import { Button } from "@heroui/react";
import { useAuth } from "../contex/authContex";

const Groups = ({ showChat }) => {
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  // const [groups, setGroups] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  const {data, isLoading} = useGetGroups()
  const {handleGroupMode,handleCurrentChat} = useAuth()

   const [isOpen, setIsOpen] = useState(false);

   const groups = useMemo(()=>{
return data?.groups?.filter(group =>
    group?.name?.toLowerCase().includes(searchTerm?.toLowerCase())
  );
   },[data, searchTerm])
  


  const changeCurrentChat = (group, id) => {
    setCurrentSelected(id);
    handleCurrentChat(group)
  handleGroupMode(true);
    showChat();
  };
  

  // const showCreateGroup = () => {
  //   document.querySelector(".first").classList.add("d-none");
  //   document.querySelector(".second").classList.remove("d-none");
  //   document.querySelector(".second").classList.add("d-flex");
  //   inputRef.current.focus();
  // };

  // useEffect(() => {
  //   getGroups();
  // }, []);

  // const getGroups = () => {
  //   setIsLoading(false);
  //   axios
  //     .post(getGroupsRoute, {
  //       member: currentUser._id,
  //     })
  //     .then((res) => {
  //       const data = res.data;
  //       const groupsIds = data.whereIAmAMember.map((member) => member.group);
  //       const groupsIBelong = data.Groups.filter((group) =>
  //         groupsIds.includes(group._id)
  //       );
  //       setGroups(groupsIBelong);
  //       setIsLoading(false);
  //     });
  // };
  // const save = async () => {
  //   if (inputRef.current.value != "") {
  //     const { data } = axios.post(createGroupRoute, {
  //       name: inputRef.current.value,
  //       admin: currentUser._id,
  //     });
  //     if (data.success) {
  //       document.querySelector(".first").classList.remove("d-none");
  //       document.querySelector(".second").classList.remove("d-flex");
  //       document.querySelector(".second").classList.add("d-none");
  //       const firstMember = {
  //         member: currentUser._id,
  //         group: data.data._id,
  //       };
  //       const response = await axios.post(addMemberRoute, firstMember);
  //       getGroups();
  //       inputRef.current.value = "";
  //       console.log(response);
  //     }
  //   }
  // };

  // const cancel = () => {
  //   document.querySelector(".first").classList.remove("d-none");
  //   document.querySelector(".second").classList.remove("d-flex");
  //   document.querySelector(".second").classList.add("d-none");
  // };

  return (
    <div className="">
         <div className="p-4 md:p-6 border-b border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white flex items-center !gap-2">
          Groups
          </h1>
          <Settings className="w-5 h-5 md:w-6 md:h-6 text-white/70 hover:text-white cursor-pointer transition-colors" />
        </div>
        
        {/* Search */}
        <div className="!relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/20 border border-white/30 rounded-xl py-2 md:py-3 !pl-10 pr-4 text-sm md:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
          />
        </div>
      </div>
      <div className="p-4">
        <Button  onPress={() => setIsOpen(true)} startContent={<Plus size={18} />} className="bg-white/80 w-full text-blue-800 shadow-lg px-2 hover:bg-white/70 font-semibold tracking-wider cursor-pointer uppercase text-sm rounded-full transition-all duration-300">Create Group</Button>
      </div>
      {isLoading ? (
     <div className="flex items-center justify-center mt-12">
     <LoaderCircle size={30} className="animate-spin" />
  </div> 
      ) : (
        <div className="">
          {groups.length == 0 ? (
            <div className="text-white text-center">
              <h5>No group found!</h5>
            </div>
          ) : (
            <div className="space-y-6 overflow-y-auto h-[65vh] px-5 mt-4">
        {      groups.map((group) => {
                return (               
                  <div
                  className={`bg-white/10 cursor-pointer flex items-center gap-4 p-2 rounded-lg
                    transition-colors duration-300 ease-in-out
                    hover:bg-white/20
                    ${currentSelected === group._id && "bg-white/15"}`}
                  key={group._id}
                  onClick={() => changeCurrentChat(group, group._id)}
                  >
                  <div className="w-[3rem] h-[3rem] rounded-full overflow-hidden">
                    <img
                      src={group.profileImage}
                      alt="picture"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="username text-white">
                    <h4>{group.name}</h4>
                  </div>
                  </div>
                );
              })}

            </div>
          )}
        </div>
      )}
         <GroupCreationModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default Groups;


