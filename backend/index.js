//create server
import express from 'express';
import cookieParser from 'cookie-parser'; // to store the user data in the cookies so that the user can be authenticated and authorized in the future requests to the server 
import cors from 'cors'; // to allow the requests from the frontend to the backend server 
import dotenv from 'dotenv'; // to use the environment variables in the project
import connectDB from './utils/db.js'; // to connect to the database

dotenv.config(); // to use the environment variables in the project
const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json()); // jabham request bhejte hain toh data json me convert karne ke liye
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));


app.listen(PORT, () => {
  connectDB(); // to connect to the database
  console.log(`Server started at port ${PORT}`);
});