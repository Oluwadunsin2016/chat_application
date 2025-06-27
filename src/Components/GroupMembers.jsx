// GroupMembers.jsx
import React, { useMemo, useState } from "react";
import { LoaderCircle, Search, Trash2 } from "lucide-react";
import { useGetMembers } from "../api/groupMutation";
import DeleteMemberModal from "./DeleteMemberModal"; // Import your modal

const GroupMembers = ({
  currentGroup,
  setCurrentPosition,
  setCurrentMember,
  currentUser,
  onlineUsers
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [memberToDelete, setMemberToDelete] = useState(null);
  const { data, isLoading } = useGetMembers(currentGroup._id);
  
  const availableMembers = useMemo(() => {
    return data?.members?.filter(info =>
      info?.member?.userName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      info?.member?.email?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      info?.member?.firstName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      info?.member?.lastName?.toLowerCase().includes(searchTerm?.toLowerCase())
    );
  }, [data, searchTerm]);

  const viewMemberDetails = (member) => {
    if (currentUser._id !== member._id) {
      setCurrentMember(member);
      setCurrentPosition("User Information");
    }
  };

  const isAdmin = currentUser._id === currentGroup.admin._id;

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

      <div className="!relative m-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search contacts..."
          className="w-full bg-white/20 border border-white/30 rounded-xl py-2 md:py-3 !pl-10 pr-4 text-sm md:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center mt-12">
          <LoaderCircle size={30} className="animate-spin" />
        </div>
      ) : (
        <div className="space-y-4 px-3 !my-4">
          {[...availableMembers]
            .sort((a, b) => {
              if (a.member._id === currentGroup.admin._id) return -1;
              if (b.member._id === currentGroup.admin._id) return 1;
              return 0;
            })
            .map((info) => (
              <div
                className={`bg-white/10 flex items-center gap-4 p-2 rounded-lg transition-colors duration-300 ease-in-out ${
                  currentUser?._id === info?.member?._id
                    ? "cursor-not-allowed"
                    : "cursor-pointer hover:bg-white/20"
                }`}
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
                  <div
                    className={`${
                      onlineUsers?.includes(info?.member?._id)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    } w-3 h-3 rounded-full border border-white absolute top-1 right-0`}
                  />
                </div>
                
                <div 
                  className="username text-white w-full flex items-center justify-between"
                  onClick={() => viewMemberDetails(info.member)}
                >
                  <div>
                    {info.member._id === currentGroup.admin._id ? (
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
                    info.member._id !== currentGroup.admin._id && 
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
            ))}
        </div>
      )}
    </div>
  );
};

export default GroupMembers;