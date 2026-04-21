
import { baseurl } from "./apipath.js";
import axios from "axios";

const axiosinstance=axios.create({
    baseURL:baseurl,
    timeout:80000,
    headers:{
        "Content-Type":"application/json",
        Accept:"application/json"
    }
})



//request interceptor
axiosinstance.interceptors.request.use((config)=>{
    const token=localStorage.getItem("token")
    if(token){
        const bearerToken = `Bearer ${token.trim()}`
        if(!config.headers){
            config.headers={}
        }
        if(typeof config.headers.set === "function"){
            config.headers.set("Authorization", bearerToken)
        }else{
            config.headers.Authorization=bearerToken
        }
    }

    // Let browser set multipart boundary automatically.
    if(config.data instanceof FormData && config.headers){
        if(typeof config.headers.delete === "function"){
            config.headers.delete("Content-Type")
        }else{
            delete config.headers["Content-Type"]
        }
    }
    return config
},(error)=>{
    return Promise.reject(error)
})

//response interceptor
axiosinstance.interceptors.response.use((response)=>{
    return response
},(error)=>{
    if(error.message){
        if(error.message?.status==500){
            console.error("server error.please try again later");
        }
    }
    else if(error.code=="ECONNABORTED"){
        console.error("request time out.please try again later");
    }
    return Promise.reject(error)
})

export default axiosinstance

