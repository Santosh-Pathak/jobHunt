import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  postJob,
  getAllJobs,
  getAdminJobs,
  getJobById,
} from "../controllers/job.controller.js";

const Router = express.Router();

Router.route("/post").post(isAuthenticated, postJob);
Router.route("/get").get(isAuthenticated, getAllJobs);
Router.route("/getadminjobs").post(isAuthenticated, getAdminJobs);
Router.route("/get/:id").post(isAuthenticated, getJobById);

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
