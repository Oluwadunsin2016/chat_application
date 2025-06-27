import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import http from "./http"


export const useCreateGroup=()=>{
    const queryClient= useQueryClient()
    return useMutation({
mutationFn:async(payload)=>{
    return await http.post('/group/create',payload)
},
onSuccess:(response)=>{
    console.log('response:',response);
    
    queryClient.invalidateQueries(['groups'])
    queryClient.invalidateQueries(['members',response.data.group._id])
}
    })
}

export const useAddMembers=()=>{
    const queryClient= useQueryClient()
    return useMutation({
mutationFn:async(payload)=>{
    return await http.post('/group/add-members',payload)
},
onSuccess:()=>{  
    queryClient.invalidateQueries(['users'])
    // queryClient.invalidateQueries(['members',response.data.group._id])
}
    })
}

export const useGetGroups=()=>{
    return useQuery({
        queryKey:['groups'],
queryFn:async()=>{
    const response = await http.get(`/group/get-groups`)
    return response.data
}
    })
}

export const useUpdateGroup=()=>{
    const queryClient= useQueryClient()
    return useMutation({
mutationFn:async(payload)=>{
    return await http.put('/group/update',payload)
},
onSuccess:(response)=>{
    console.log('response:',response);
    
    queryClient.invalidateQueries(['groups'])
}
    })
}

export const useDeleteMember = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async (payload) => {
        return await http.delete('/group/remove-member', {
          data: payload // Axios expects payload in data property for DELETE
        });
      },
      onSuccess: (response, variables) => {
        // Invalidate group members query
        queryClient.invalidateQueries(['members', variables.groupId]);
        
        // Also invalidate the group list if needed
        queryClient.invalidateQueries(['groups']);
        
        return response;
      },
      onError: (error) => {
        // Handle error or throw for component to catch
        throw new Error(error.response?.data?.message || "Failed to delete member");
      }
    });
  };


export const useGetMembers=(groupId)=>{
    return useQuery({
        queryKey:['members', groupId],
queryFn:async()=>{
    const response = await http.get(`/group/get-members/${groupId}`)
    return response.data
}
    })
}

export const useSendMessage=()=>{
    const queryClient= useQueryClient()
    return useMutation({
mutationFn:async(payload)=>{
    return await http.post('/group/send-message',payload)
},
onSuccess:(_,payload)=>{
    queryClient.invalidateQueries(['messages',payload.from])
}
    })
}

export const useMarkGroupAsRead=()=>{
    const queryClient= useQueryClient()
    return useMutation({
        mutationFn:async(payload)=>{
    return await http.post('/group/markGroupAsRead',payload)
},
onSuccess:()=>{
    queryClient.invalidateQueries(['chats'])
}
    })
}

export const useGetMessageHistory=(groupId)=>{
    return useQuery({
        queryKey:['messages',groupId],
queryFn:async()=>{
    const response = await http.get(`/group/group-history/${groupId}`)
    return response.data.history
}
    })
}