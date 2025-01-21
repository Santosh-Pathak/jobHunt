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
Router.route("/get").get(isAuthenticated, getCompanies);
Router.route("/get/:id").get(isAuthenticated, getCompanyById);
Router.route("/update/:id").put(isAuthenticated, updateCompany);

export default Router;
// Compare this snippet from backend/controllers/company.controller.js: