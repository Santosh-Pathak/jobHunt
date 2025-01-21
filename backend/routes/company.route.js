import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  registerCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
} from "../controllers/company.controller.js";

const Router = express.Router();

Router.route("/register").post(isAuthenticated, registerCompany);
Router.route("/get").post(isAuthenticated, getCompanies);
Router.route("/get/:id").post(isAuthenticated, getCompanyById);
Router.route("/update/:id").get(isAuthenticated, updateCompany);

export default Router;
