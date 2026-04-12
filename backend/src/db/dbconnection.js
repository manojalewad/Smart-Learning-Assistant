import mongoose from "mongoose";

const DB_NAME="aiassistant"
const connectDB=async()=>{
    try {
        const resp=await mongoose.connect(`${process.env.MONGODB_URL}`)
        console.log("DB connected sucessfully",resp.connection.host);
    } catch (error) {
        console.log("error while connection data base :",error);
        process.exit(1);
    }
}

export default connectDB;