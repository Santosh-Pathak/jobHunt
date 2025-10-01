import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  applyJob,
  getAppliedJobs,
  getApplicants,
  updateStatus,
} from "../controllers/application.controller.js";

const Router = express.Router();

Router.route("/apply/:id").post(isAuthenticated, applyJob);
Router.route("/get").get(isAuthenticated, getAppliedJobs);
Router.route("/:id/applicants").get(isAuthenticated, getApplicants);
Router.route("/status/:id/update").put(isAuthenticated, updateStatus);

export default Router;
