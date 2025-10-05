import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure dotenv to look for .env file in the backend root directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectDB = async () => {
  try {
    // Use the provided MongoDB connection string directly
    const mongoURI = process.env.MONGO_URI;
    console.log(`Using MongoDB URI: ${mongoURI ? 'Provided' : 'Not Provided'}`);
    if (!mongoURI) {
        console.error('MONGO_URI environment variable is required');
        process.exit(1);
    }
    
    console.log("Attempting to connect to MongoDB...");
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected Successfully : ${conn.connection.host}`); 
    console.log(`Database Name: ${conn.connection.name}`);

  } catch (error) {
    console.error(`Error at Connecting to MongoDB: ${error.message}`);
    console.error("Connection details:");
    console.error("- Make sure your MongoDB Atlas cluster is running and accessible");
    console.error("- Check if your IP address is whitelisted in MongoDB Atlas");
    process.exit(1);
  }
} 
export default connectDB;