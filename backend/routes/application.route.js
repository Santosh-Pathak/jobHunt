import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  applyJob,
  getAppliedJobs,
  getApplicants,
  updateStatus,
} from "../controllers/application.controller.js";

const Router = express.Router();
Router, use(isAuthenticated);

Router.route("/apply/:id").post(applyJob);
Router.route("/get").get(getAppliedJobs);
Router.route("/:id/applicants").get(getApplicants);
Router.route("/status/:id/update").put(updateStatus);

export default Router;
