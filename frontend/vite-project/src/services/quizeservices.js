import { api_paths } from "../utils/apipath";
import axiosinstance from "../utils/axiosinstance";


const getallquizes=async(id)=>{
    try {
        const response=await axiosinstance.get(api_paths.Quize.GetAllQuizes(id));
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const getquizebyid=async(id)=>{
    try {
        const response=await axiosinstance.get(api_paths.Quize.GetQuizeById(id));
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
const submitquize=async(id,answer)=>{
    try {
        const response=await axiosinstance.post(api_paths.Quize.SubmitQuize(id),{answer});
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const getquizresult=async(id)=>{
    try {
        const response=await axiosinstance.get(api_paths.Quize.GetQuizeResult(id));
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const deletequize=async(id)=>{
    try {
        const response=await axiosinstance.delete(api_paths.Quize.DeleteQuize(id));
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const quizeservices= {getallquizes,getquizebyid,submitquize,getquizresult,deletequize};