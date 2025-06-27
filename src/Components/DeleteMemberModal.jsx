// DeleteMemberModal.jsx
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { LoaderCircle } from 'lucide-react';
import { useDeleteMember } from '../api/groupMutation';
import { setToast } from './Toast/toastUtils';
import { useState } from 'react';

export default function DeleteMemberModal({
  onCancel,
  isOpen,
  onOpenChange,
  memberToDelete,
  currentGroup
}) {
  const { mutateAsync: deleteMember, isPending } = useDeleteMember();
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDeleteMember = async () => {
    if (!memberToDelete || !currentGroup) return;
    
    try {
      const result = await deleteMember({ 
        groupId: currentGroup._id, 
        memberId: memberToDelete._id 
      });
      
      if (result?.status) {
        setToast("success", result?.message || `${memberToDelete.userName} removed successfully`);
        setIsDeleted(true);
        
        // Close modal after 1.5 seconds
        setTimeout(() => {
          onOpenChange(false);
          setIsDeleted(false);
        }, 1500);
      }
    } catch (error) {
      setToast("error", error.message || "Failed to delete member");
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="text-xl font-bold">
          Remove {memberToDelete?.userName} from group?
        </ModalHeader>
        
        <ModalBody>
          {isDeleted ? (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-green-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-center">
                {memberToDelete?.userName} has been removed from the group
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-500 mb-2">
                This will remove <span className="font-semibold">{memberToDelete?.userName}</span> from the group permanently.
              </p>
              <p className="text-orange-400 text-sm">
                This action cannot be undone.
              </p>
            </>
          )}
        </ModalBody>
        
        {!isDeleted && (
          <ModalFooter>
            <Button 
              color="default"
              onPress={onCancel}
            >
              Cancel
            </Button>
            <Button 
              color="danger" 
              className="rounded-lg bg-red-600 hover:bg-red-700 text-white"
              onPress={handleDeleteMember}
              disabled={isPending}
            >
              {isPending ? (
                <span className='flex items-center justify-center gap-1'>
                  <LoaderCircle className="w-5 h-5 animate-spin text-white" /> 
                  Removing...
                </span>
              ) : (
                'Remove Member'
              )}
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}