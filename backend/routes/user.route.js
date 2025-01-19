import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { registerUser, login, updateProfile } from '../controllers/user.controller.js';


const Router = express.Router();


Router.route('/register').post(registerUser);
Router.route('/login').post(login);
Router.route('/profile/update').post(isAuthenticated,updateProfile);


export default Router;
