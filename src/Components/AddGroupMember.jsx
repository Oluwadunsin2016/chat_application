
import React, { useEffect, useMemo, useState } from "react";
import { setToast } from "./Toast/toastUtils";
import { useAddMembers, useGetMembers } from "../api/groupMutation.js";
import { useGetAllUsers } from "../api/authMutation.js";
import { LoaderCircle, Plus, Search, X } from "lucide-react";
import { Button } from "@heroui/react";

const AddGroupMember = ({ currentGroup,onlineUsers }) => {
// const [isLoading, setIsLoading] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableContacts, setAvailableContacts] = useState([]);
  const {data:users} = useGetAllUsers()
  const {data:data, isLoading} = useGetMembers(currentGroup._id)
  const {mutateAsync:addMember, isPending:addingMember} = useAddMembers()

  const contacts= useMemo(() => {
    return users?.data
  },[users]);

  const availableMembers= useMemo(() => {
    return data?.members
  },[data]);



  useEffect(() => {
    getAvailableContacts();
  }, [users,data]);

  const getAvailableContacts = () => {
  const memberIds = availableMembers?.map((user) => user.member._id);
  setAvailableContacts(
    contacts?.filter((user) => !memberIds?.includes(user._id))
  );
  };

  const filteredContacts = availableContacts?.filter(contact =>
    contact.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMemberSelect = (contact) => {
    if (selectedMembers.find(member => member._id === contact._id)) {
      setSelectedMembers(selectedMembers.filter(member => member._id !== contact._id));
    } else {
      setSelectedMembers([...selectedMembers, contact]);
    }
  };

  const handleAddMember = async () => {
    const memberIds = selectedMembers.map(member=>member._id)
    const payload = { memberIds, groupId: currentGroup._id };
    console.log(payload);
    try {
      const {data} = await addMember(payload);
        setToast("success",data.message||'Members add successfully')
        setSelectedMembers([])
      } catch (error) {
        console.log("error:", error)
        setToast("error", error?.response?.data.message || "Error Adding members");
        setSelectedMembers([])
    }
  };
  return (
    <div className="h-[90vh] overflow-y-auto">
      {isLoading? <div className="d-flex justify-content-center align-items-center mt-5">
        <div class="spinner-border text-light mx-auto" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
       </div> :
    <div className="space-y-6 overflow-y-auto h-[75vh] px-5 mt-4">
               <div className="!relative !my-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                      <input
                        type="text"
                        value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search contacts..."
                        className="w-full bg-white/20 border border-white/30 rounded-xl py-2 md:py-3 !pl-10 pr-4 text-sm md:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                      />
                    </div>

            {/* Selected Members */}
            {selectedMembers.length > 0 && (
              <div className="mb-3">
                <div className="text-sm text-gray-300 mb-2">Selected ({selectedMembers.length})</div>
                <div className="flex flex-wrap !gap-2">
                  {selectedMembers.map(member => (
                    <div key={member._id} className="flex items-center bg-white/60 text-blue-800 px-2 py-1 rounded-full text-sm">
                      <div className="w-[2rem] h-[2rem] rounded-full overflow-hidden mr-2">
               <img
                 src={member.profileImage}
                 alt="picture"
                 className="w-full h-full object-cover object-top"
               />
             </div>
                      <span>{member.firstName} {member.lastName}</span>
                      <button
                        onClick={() => handleMemberSelect(member)}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end px-4">
                  <Button disabled={addingMember} onPress={handleAddMember} startContent={addingMember? <LoaderCircle size={16} className="animate-spin"/> :<Plus size={18} />} size="sm" className="bg-white/80 text-blue-800 shadow-lg px-2 hover:bg-white/70 rounded cursor-pointer transition-all duration-300">{addingMember?"Adding...":"Add"}</Button>
                </div>
              </div>
            )}

            {/* Contact List */}
            <div className="flex flex-col items-center gap-4 mt-6">
              {filteredContacts.map(contact => {
                const isSelected = selectedMembers.find(member => member._id === contact._id);
                return (
                  <div
                    key={contact._id}
                    onClick={() => handleMemberSelect(contact)}
                    className={`flex items-center p-2 w-full bg-white/15 hover:bg-white/25 rounded-lg cursor-pointer ${
                      isSelected ? 'bg-white/35' : ''
                    }`}
                  >
                      <div className="w-[2rem] h-[2rem] mr-2 relative">
               <img
                 src={contact.profileImage}
                 alt="picture"
                 className="w-full h-full rounded-full object-cover object-top"
               />
               <div className={`${onlineUsers?.includes(contact._id) ? 'bg-green-500' : 'bg-gray-300'} w-3 h-3 rounded-full border border-white absolute top-1 right-0`} />
             </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-200">{contact.firstName} {contact.lastName}</div>
                      <div className="text-xs text-gray-300">{contact.email}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </div>
                );
              })}
              {filteredContacts.length === 0 && (
                <div className="p-4 text-center text-gray-200">
                  No contacts found
                </div>
              )}
            </div>
    </div>
        }
    </div>
  );
};

export default AddGroupMember;