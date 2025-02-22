import mongoose from "mongoose";
import { DB_NAME } from "../controllers/constants.js";


const connectDB = async () => {
    try {
      const ConnectionInstance =  await mongoose.connect(`${process.env.MONGOD_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB Host : ${ConnectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("MONGODB connection error", error);
        process.exit(1)
    }
}

export default connectDB;