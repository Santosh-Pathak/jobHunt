import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
// Try multiple possible locations for .env file
dotenv.config({ path: path.join(__dirname, "../../.env") });
dotenv.config({ path: path.join(__dirname, "../.env") });
dotenv.config(); // Fallback to default location

const connectDB = async () => {
  try {
    // Use the provided MongoDB connection string directly
    const mongoURI = process.env.MONGO_URI || "mongodb+srv://jobHunt:ql6h6WMQsNZCONUl@cluster0.bachoqr.mongodb.net/jobHunt?retryWrites=true&w=majority&appName=Cluster0";
    
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