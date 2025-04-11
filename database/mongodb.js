import mongoose from "mongoose";
import { DB_URI,NODE_ENV } from "../config/env.js";

if(!DB_URI) {
    throw new Error("DB_URI is not defined in the environment variables. please define it in the .env.<development/production>.local file."); 
}   

const connectToDatabase = async () => {
    try{
        await mongoose.connect(DB_URI);

        console.log(`Connected to the database in ${NODE_ENV} mode successfully.`);

    }catch (e) {
        console.error("Error connecting to the database:", e);
        process.exit(1);
    }

}

export default connectToDatabase;