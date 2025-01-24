import { Application } from "../models/application.model";
import Job from "../models/job.model";

export const applyJob = async (req, res) => {
  try {
    const userId = req?.id;
    const { id: jobId } = req.params;
    //jobId = req.params.id;

    if (!jobId)
      return res
        .status(400)
        .json({ message: "Job Id is required", success: false });

    // check whether user has already applied for the job
    const exitingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (exitingApplication)
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });

    // Check whether the job exists
    const job = await Job.findOne({ jobId });
    if (!job)
      return res
        .status(400)
        .json({ message: "Job does not exist", success: false });

    //Since Job is Found so creare a new Application for the job
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.Application.push(newApplication._id);
    await job.save();

    return res.send({
      message: "Application submitted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req?.id;
    // here we  have used nested populate to get the company details of
    //  the job applied by the user and also sorted the jobs based on the
    // createdAt field in descending order and also sorted the companies based on the
    // createdAt field in descending order to get the latest job and company details
    // first in the response array of jobs applied by the user and also used options to
    // sort the companies based on the createdAt field in descending order to get the
    // latest company details first in the response array of jobs applied by the user
    // and also used options to sort the companies based on the createdAt field in
    // descending order to get the latest company details first in the response array
    //  of jobs applied by the user

    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options,
        },
      });
    if (!application)
      return res
        .status(400)
        .json({ message: "No application found", success: false });

    return res.send({ application, success: true });
  } catch (error) {
    console.log(error);
  }
};

//admin dekhega kitne users ne Apply kiya h
export const getApplicants = async (res, req) => {
  try {
    const jobId = req.params?.id;
    const jobExist = await Job.findById(jobId).populate({
      pth: "applications",
      options: {
        sort: { createdAt: -1 },
        populate: {
          path: "applicant",
        },
      },
    });

    if (!jobExist) {
      res.send(404).json({ message: "Job Not Found", success: false });
    }

    return res.status(200).json({ jobExist, message: "", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params?.id;

    // Validate input
    if (!status) {
      return res
        .status(400) // Bad Request
        .json({ message: "Status is required", success: false });
    }

    // Find the application by applicationId
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res
        .status(404) // Not Found
        .json({ message: "Application not found", success: false });
    }

    // Update the status of the application
    application.status = status.toLowerCase();
    await application.save();

    return res
      .status(200) // OK
      .json({ message: "Status updated successfully", success: true });
  } catch (error) {
    console.error("Error updating status:", error);
    return res
      .status(500) // Internal Server Error
      .json({
        message: "An error occurred while updating status",
        success: false,
      });
  }
};
