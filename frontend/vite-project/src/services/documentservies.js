import { api_paths } from "../utils/apipath";
import axiosinstance from "../utils/axiosinstance";

const uploaddocument=async(formdata)=>{
    try {
        const response=await axiosinstance.post(api_paths.Documents.Upload,formdata,{
            headers:{
                "Content-Type":"multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {message:"file uploading went wrong"}
    }
}

const getdocuments=async()=>{
    try {
        const response=await axiosinstance.get(api_paths.Documents.GetDocuments);
        return response.data.data;
    } catch (error) {
        throw error.response?.data || {message:"something went wrong in to get documents"}
    }
}

const getdocumentbyid=async(id)=>{
    try {
        const response=await axiosinstance.get(api_paths.Documents.GetDocumentById(id));
        return response.data;
    } catch (error) {
        throw error.response?.data || {message:"something went wrong in to get document by id"}
    }
}

const deletedocument=async(id)=>{
    try {
        const response=await axiosinstance.delete(api_paths.Documents.DeleteDocument(id));
        return response.data;
    } catch (error) {
        throw error.response?.data || {message:"something went wrong in to delete document"}
    }
}

const updatedocument=async(id,formdata)=>{
    try {
        const response=await axiosinstance.post(api_paths.Documents.UpdateDocument(id),formdata);
        return response.data;
    } catch (error) {
        throw error.response?.data || {message:"something went wrong in to update document"}
    }
}

export const documentservices={uploaddocument,getdocuments,getdocumentbyid,deletedocument,updatedocument};