import React, { useEffect, useState } from 'react';
import { X, LoaderCircle } from 'lucide-react';
import "animate.css";
import { useGetGroups, useUpdateGroup } from '../api/groupMutation';
import { setToast } from './Toast/toastUtils';
import { useAuth } from '../contex/authContex';

export default function GroupEditModal({ isOpen, onClose, group }) {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const { mutateAsync: updateGroup, isPending } = useUpdateGroup();
  const {data} = useGetGroups()
    const {handleCurrentChat} = useAuth()



    useEffect(() => {
     const current= data?.groups?.find(reccentGroup=>reccentGroup._id==group?._id)
     handleCurrentChat(current)
    }, [data,group])

  useEffect(() => {
   if (group) {
     setGroupName(group?.name)
     setGroupDescription(group?.description)
   }
  }, [group])
  

  const handleUpdateGroup = async () => {
    try {
      await updateGroup({ 
        groupId: group._id,
        name: groupName,
        description: groupDescription,
      });
      setToast("success", 'Group updated successfully!');
      handleClose();
    } catch (error) {
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

  const isFormValid = groupName?.trim();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden comeIn animate__animated animate__fadeInDown">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit Group</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
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
              onClick={handleUpdateGroup}
              disabled={!isFormValid || isPending}
              className={`flex-1 px-4 py-2 cursor-pointer rounded-lg font-medium transition-colors ${
                isFormValid && !isPending
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isPending ? (
                <span className='flex items-center justify-center !gap-2'>
                  <LoaderCircle size={20} className='animate-spin' /> 
                  Saving...
                </span>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}