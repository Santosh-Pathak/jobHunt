import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAuthorized from "../middlewares/isAuthorized.js";
import {
  postJob,
  getAllJobs,
  getAdminJobs,
  getJobById,
} from "../controllers/job.controller.js";

const Router = express.Router();

// Public routes
Router.route("/get").get(getAllJobs); // Get all jobs (public)
Router.route("/get/:id").get(getJobById); // Get job by ID (public)

// Protected routes - require authentication and recruiter role
Router.route("/post").post(isAuthenticated, isAuthorized(['recruiter', 'admin']), postJob); // Post job (requires recruiter role)
Router.route("/getadminjobs").get(isAuthenticated, isAuthorized(['recruiter', 'admin']), getAdminJobs); // Get admin jobs (requires recruiter role)

export default Router;

/*
    import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  postJob,
  getAllJobs,
  getAdminJobs,
  getJobById,
} from "../controllers/job.controller.js";

const Router = express.Router();

// Apply authentication middleware to all routes
Router.use(isAuthenticated);

// Define routes
Router.route("/jobs").post(postJob).get(getAllJobs); // POST to create, GET to fetch all jobs
Router.route("/admin/jobs").get(getAdminJobs); // GET to fetch admin jobs
Router.route("/jobs/:id").get(getJobById); // GET to fetch job by ID

export default Router;

*/
