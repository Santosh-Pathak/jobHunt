import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { register, login, updateProfile, LogOut } from '../controllers/user.controller.js';


const Router = express.Router();


Router.route('/register').post(register);
Router.route('/login').post(login);
Router.route('/profile/update').post(isAuthenticated,updateProfile);
Router.route('/logout').get(LogOut);


export default Router;
