import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import http from "./http"


export const useSendMessage=()=>{
    const queryClient= useQueryClient()
    return useMutation({
mutationFn:async(payload)=>{
try {
   return await http.post('/message/sendMessage',payload)
} catch (error) {
    throw Error(error)
}
},
onSuccess:(_,payload)=>{
    queryClient.invalidateQueries(['chats'])
    queryClient.invalidateQueries(['messages',payload.from])
}
    })
}
export const useMarkAsRead=()=>{
    const queryClient= useQueryClient()
    return useMutation({
mutationFn:async(payload)=>{
    return await http.post('/message/markAsRead',payload)
},
onSuccess:(_,payload)=>{
    queryClient.invalidateQueries(['chats'])
    queryClient.invalidateQueries(['messages',payload.from])
}
    })
}
export const useGetChats=()=>{
    return useQuery({
        queryKey:['chats'],
queryFn:async()=>{
try {
   const response = await http.get('/message/user-chats')
   return response.data.chats
} catch (error) {
    throw Error(error)
}
}
    })
}

export const useGetMessageHistory=(userId)=>{
    return useQuery({
        queryKey:['messages',userId],
queryFn:async()=>{
try {
   const response = await http.get(`/message/get-history/${userId}`)
   return response.data.history
} catch (error) {
    throw Error(error)
}
}
    })
}