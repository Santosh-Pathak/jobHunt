import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected SuccessFully : ${conn.connection.host}`); 

  } catch (error) {
    console.error(`Error at Connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
} 
export default connectDB;