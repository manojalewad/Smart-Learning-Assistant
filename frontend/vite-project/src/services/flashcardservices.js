import { apierror } from "../../../../backend/src/utils/apierror";
import { api_paths } from "../utils/apipath";
import axiosinstance from "../utils/axiosinstance";



const getallflashcards=async()=>{
    try {
        const response=await axiosinstance.get(api_paths.Flashcard.GetAllFlashcards);
        return response.data;
    } catch (error) {
        throw new apierror(400,"something went wrong in to get all flashcards");
    }
}

const getflashcards=async(id)=>{
    try {
        const response=await axiosinstance.get(api_paths.Flashcard.GetFlashcardsForDoc(id));
        return response.data;
    } catch (error) {
        throw new apierror(400,"something went wrong in to get flashcards");
    }
}

const deleteflashcardset=async(id)=>{
    try {
        const response=await axiosinstance.delete(api_paths.Flashcard.DeleteFlashcard(id));
        return response.data;
    } catch (error) {
        throw new apierror(400,"something went wrong in to delete flashcardset");
    }
}

const reviewflashcards=async(id,cardindex)=>{
    try {
        const response=await axiosinstance.post(api_paths.Flashcard.ReviewFlashcards(id),{cardindex});
        return response.data;
    } catch (error) {
        throw new apierror(400,"something went wrong in to review flashcards");
    }
}

const toggleflashcard=async(id)=>{
    try {
        const response=await axiosinstance.put(api_paths.Flashcard.StarFlashcard(id));
        return response.data;
    } catch (error) {
        throw new apierror(400,"something went wrong in to toggle flashcard");
    }
}
const getflashcardsetbyid=async(id)=>{
    try {
        const response=await axiosinstance.get(api_paths.Flashcard.GetFlashcardSetById(id));
        return response.data;
    } catch (error) {
       console.error(error);
    }
}

export const flashcardservices= {getallflashcards,getflashcards,deleteflashcardset,toggleflashcard,reviewflashcards,getflashcardsetbyid};