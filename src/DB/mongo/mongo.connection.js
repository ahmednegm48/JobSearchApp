import mongoose from 'mongoose';
import { DB_URI } from '../../config/config.service.js';


const connectDB = async () =>{
    try{
        await mongoose.connect(DB_URI,{dbName:"JobSearchApp",serverSelectionTimeoutMS:5000});
        console.log("Connected to database successfully")
    }catch(error){
        console.log("failed Connection",error)
    }
}

export default connectDB;