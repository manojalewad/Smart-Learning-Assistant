import { api_paths } from "../utils/apipath";
import axiosinstance from "../utils/axiosinstance";

const dashboard=async()=>{
    try {
        const response=await axiosinstance.get(api_paths.Progress.Dashboard);
        return response.data.data;
    } catch (error) {
        throw new apierror(400,"something went wrong in to get dashboard data");
    }
}
const progresservies={
    dashboard
}
export default progresservies;