import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import http from "./http"


export const useRegister=()=>{
    return useMutation({
mutationFn:async(payload)=>{
try {
   return await http.post('/auth/register',payload)
} catch (error) {
    throw Error(error)
}
}
    })
}
export const useLogin=()=>{
    const queryClient=useQueryClient()
    return useMutation({
mutationFn:async(payload)=>{
    return await http.post('/auth/login',payload)

},
onSuccess:async()=>{
queryClient.invalidateQueries(['user'])
}
    })
}
export const useUpdateUser=()=>{
    const queryClient = useQueryClient()
    return useMutation({
mutationFn:async(payload)=>{
    return await http.put('/auth/editUser',payload);
},
onSuccess:async()=>{
queryClient.invalidateQueries(['user'])
}
    })
}
export const useUploadProfileImage=()=>{
    const queryClient = useQueryClient()
    return useMutation({
mutationFn:async(payload)=>{
try {
   return await http.post('/auth/upload',payload)
} catch (error) {
    throw Error(error)
}
},
onSuccess:async()=>{
queryClient.invalidateQueries(['user'])
}
    })
}
export const useGetLoginUser = () => {
    return useQuery({
      queryKey: ["user"],
      queryFn: () => http.get("/auth/user"),
      enabled: !!localStorage.getItem("chatToken"), // ✅ only run if token exists
      staleTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    });
  };

export const useGetAllUsers=()=>{
    return useQuery({
        queryKey:['users'],
queryFn:async()=>{
try {
   return await http.get('/auth/allUsers')
} catch (error) {
    throw Error(error)
}
}
    })
}