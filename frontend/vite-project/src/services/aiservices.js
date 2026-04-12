import { api_paths } from "../utils/apipath";
import axiosinstance from "../utils/axiosinstance";

const getchathistory=async(documentid)=>{
    try {
        const response=await axiosinstance.post(api_paths.Ai.GetChatHistory,{documentid});
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const getchat=async(documentid,question)=>{
    try {
        const response=await axiosinstance.post(api_paths.Ai.Chat,{documentid,question});
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const explainconcept=async(documentid,concept)=>{
    try {
        const response=await axiosinstance.post(api_paths.Ai.ExplainConcept,{documentid,concept});
        return response.data;
    } catch (error) {
        throw error.respones?.data || {message:"something went wrong"}
    }
}

const generatesummary=async(documentid)=>{
    try {
        const response=await axiosinstance.post(api_paths.Ai.GenerateSummary,{documentid});
        return response.data;
    } catch (error) {
        throw error.respones?.data || {message:"something went wrong"}
    }
}

const generateflashcard=async(documentid,options)=>{
    try {
        const response=await axiosinstance.post(api_paths.Ai.GenerateFlashcards,{documentid,...options});
        return response.data;
    } catch (error) {
        throw error.respones?.data || {message:"something went wrong"}
    }
}

const generatequiz=async(documentid,options)=>{
    try {
        const response=await axiosinstance.post(api_paths.Ai.GenerateQuize,{documentid,...options});
        return response.data;
    } catch (error) {
        throw error.respones?.data || {message:"something went wrong"}
    }
}

export const aiservices={getchathistory,getchat,explainconcept,generatesummary,generateflashcard,generatequiz};