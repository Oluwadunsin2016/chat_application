import React, { useState } from 'react';
import { X, Users, Camera, Search, Plus, LoaderCircle } from 'lucide-react';
import "animate.css"
import { useGetAllUsers } from '../api/authMutation';
import { useCreateGroup } from '../api/groupMutation';
import { setToast } from './Toast/toastUtils';

export default function GroupCreationModal({isOpen, onClose}) {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupImage, setGroupImage] = useState(null);
    const {data:contacts} = useGetAllUsers()
    const {mutateAsync:createGroup, isPending}= useCreateGroup()



  const filteredContacts = contacts?.data?.filter(contact =>
    contact.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMemberSelect = (contact) => {
    if (selectedMembers.find(member => member._id === contact._id)) {
      setSelectedMembers(selectedMembers.filter(member => member._id !== contact._id));
    } else {
      setSelectedMembers([...selectedMembers, contact]);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setGroupImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCreateGroup = async() => {
    const selectMembersIds = selectedMembers.map(member=>member._id)
    const groupData = {
      name: groupName,
      description: groupDescription,
      members: selectMembersIds,
      image: groupImage,
    };
    try {
      await createGroup(groupData)
      console.log('Creating group:', groupData);
      setGroupName('')
      setGroupDescription('')
      setGroupImage(null)
      setSelectedMembers([])
      setToast("success", 'Group created successfully!');
      handleClose();
    } catch (error) {
      console.log(error?.response?.data?.message)
      setToast("error", error?.response?.data?.message, 'top-right');
    }
  };

  const handleClose = () => {
    document.querySelector(".comeIn").classList.remove("animate__fadeInDown");
    document.querySelector(".comeIn").classList.add("animate__fadeOutUp");
    setTimeout(() => {
        onClose();
      document.querySelector(".comeIn").classList.remove("animate__fadeOutUp");
      document.querySelector(".comeIn").classList.add("animate__fadeInDown");
    }, 500);
  };

  const isFormValid = groupName.trim() && selectedMembers.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden comeIn animate__animated animate__fadeInDown">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create New Group</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Group Image */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
                {groupImage ? (
                  <img src={groupImage} alt="Group" className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-8 h-8 text-white" />
                )}
              </div>
              <label htmlFor="group-image" className="absolute bottom-0 -right-1 bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full cursor-pointer transition-colors">
                <Camera className="w-3 h-3" />
              </label>
              <input
                id="group-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Group Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name *
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              maxLength={50}
            />
            <div className="text-xs text-gray-500 mt-1">{groupName.length}/50</div>
          </div>

          {/* Group Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="What's this group about?"
              rows={3}
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              maxLength={200}
            />
            <div className="text-xs text-gray-500 mt-1">{groupDescription.length}/200</div>
          </div>

          {/* Add Members */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Members *
            </label>
            
            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search contacts..."
                className="w-full !pl-10 !pr-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Selected Members */}
            {selectedMembers.length > 0 && (
              <div className="mb-3">
                <div className="text-sm text-gray-600 mb-2">Selected ({selectedMembers.length})</div>
                <div className="flex flex-wrap !gap-2">
                  {selectedMembers.map(member => (
                    <div key={member._id} className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
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
              </div>
            )}

            {/* Contact List */}
            <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
              {filteredContacts.map(contact => {
                const isSelected = selectedMembers.find(member => member._id === contact._id);
                return (
                  <div
                    key={contact._id}
                    onClick={() => handleMemberSelect(contact)}
                    className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                  >
                      <div className="w-[2rem] h-[2rem] rounded-full overflow-hidden mr-2">
               <img
                 src={contact.profileImage}
                 alt="picture"
                 className="w-full h-full object-cover object-top"
               />
             </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{contact.firstName} {contact.lastName}</div>
                      <div className="text-xs text-gray-500">{contact.email}</div>
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
                <div className="p-4 text-center text-gray-500">
                  No contacts found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex space-x-3 mb-4">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 cursor-pointer text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateGroup}
              disabled={!isFormValid || isPending}
              className={`flex-1 px-4 py-2 cursor-pointer rounded-lg font-medium transition-colors ${
                isFormValid || isPending
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
             
              
              {isPending? <span className='flex items-center justify-center !gap-2'><LoaderCircle size={20} className='animate-spin' /> Creating...</span>:<span>Create Group</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}