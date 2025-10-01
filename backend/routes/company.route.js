import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAuthorized from "../middlewares/isAuthorized.js";
import {
  registerCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  getAllCompanies,
} from "../controllers/company.controller.js";

const Router = express.Router();

// Public routes
Router.route("/get").get(getAllCompanies); // Get all companies (public)
Router.route("/get/:id").get(getCompanyById); // Get company by ID (public)

// Protected routes - require authentication and recruiter role
Router.route("/register").post(isAuthenticated, isAuthorized(['recruiter', 'admin']), registerCompany);
Router.route("/my-companies").get(isAuthenticated, isAuthorized(['recruiter', 'admin']), getCompanies); // Get user's companies
Router.route("/update/:id").put(isAuthenticated, isAuthorized(['recruiter', 'admin']), updateCompany);

export default Router;
// Compare this snippet from backend/controllers/company.controller.js: