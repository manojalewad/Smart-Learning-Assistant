import axiosinstance from "../utils/axiosinstance";
import { api_paths } from "../utils/apipath";


const login=async(email,password)=>{
    try {
        const response=await axiosinstance.post(api_paths.Auth.Login,{email,password});
        return response.data.data;
    } catch (error) {
        throw error.response?.data || {message:error.message}
    }
}

const register=async(username,email,password)=>{
    try {
        const response=await axiosinstance.post(api_paths.Auth.Register,{username,email,password});
        return response.data;
    } catch (error) {
        throw error.response?.data || {message:"something went wrong"}
    }
}

const changepassword=async({oldpassword,newpassword})=>{
    try {
        const response=await axiosinstance.put(api_paths.Auth.Changepassword,{oldpassword,newpassword});
        return response.data;
    } catch (error) {
        throw error.response?.data || {message:"something went wrong"}
    }
}

const updateprofile=async(username,profilepicture,email)=>{
    try {
        const response=await axiosinstance.post(api_paths.Auth.Updateprofile,{username,profilepicture,email});
        return response.data;
    } catch (error) {
        throw error.response?.data || {message:"something went wrong"}
    }
}

const getprofile=async()=>{
    try {
        const response=await axiosinstance.get(api_paths.Auth.Getprofile);
        return response.data;
    } catch (error) {
        throw error.response?.data || {message:"something went wrong"}
    }
}

const authservices={
    login,register,changepassword,updateprofile,getprofile
}
export default authservices;