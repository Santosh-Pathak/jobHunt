import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { register, login, updateProfile, LogOut, savedJobs } from '../controllers/user.controller.js';
import { singleUpload } from '../middlewares/multer.js';


const Router = express.Router();


Router.route('/register').post(singleUpload, register);
Router.route('/login').post(login);
Router.route('/profile/update').post(isAuthenticated, singleUpload, updateProfile);
Router.route('/logout').get(LogOut);
Router.route('/savedjob').post(isAuthenticated, savedJobs);

// Test endpoint
Router.route('/test').get((req, res) => {
    res.json({ message: "User routes working!", timestamp: new Date().toISOString() });
});


export default Router;
