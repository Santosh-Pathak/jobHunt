import mongoose from 'mongoose';
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.user?._id || req.id || req._id;
    const { id: jobId } = req.params;
    const { coverLetter, expectedSalary, availability, noticePeriod } = req.body;

    console.log('Apply job request:', { userId, jobId, body: req.body });

    if (!jobId)
      return res
        .status(400)
        .json({ message: "Job Id is required", success: false });

    if (!userId)
      return res
        .status(401)
        .json({ message: "User not authenticated", success: false });

    // check whether user has already applied for the job
    const existingApplication = await Application.findOne({
      job: jobId,
      user: userId,
    });
    if (existingApplication)
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });

    // Check whether the job exists
    const job = await Job.findById(jobId).populate('company');
    if (!job)
      return res
        .status(400)
        .json({ message: "Job does not exist", success: false });

    // Get user's resume (optional for now)
    const user = await mongoose.model('User').findById(userId);
    
    // Create new application with default values if not provided
    const newApplication = await Application.create({
      user: userId,
      job: jobId,
      company: job.company._id,
      coverLetter: coverLetter || "I am interested in this position and would like to apply.",
      resume: user?.profile?.resume || "", // Resume is optional for now
      resumeOriginalName: user?.profile?.resumeOriginalName || "",
      expectedSalary,
      availability,
      noticePeriod,
      status: 'pending'
    });

    // Add application to job
    job.applications.push(newApplication._id);
    job.applicationsCount = job.applications.length;
    await job.save();

    return res.status(201).json({
      message: "Application submitted successfully",
      success: true,
      application: newApplication
    });
  } catch (error) {
    console.error('Error applying for job:', error);
    return res.status(500).json({
      message: "An error occurred while submitting application",
      success: false,
    });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { page = 1, limit = 20, status } = req.query;

    const filter = { user: userId };
    if (status) filter.status = status;

    const applications = await Application.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "name logo industry"
        }
      })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Application.countDocuments(filter);

    return res.status(200).json({ 
      success: true, 
      applications,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching applied jobs:', error);
    return res.status(500).json({
      message: "An error occurred while fetching applications",
      success: false,
    });
  }
};

// Get applicants for a specific job (for recruiters/admin)
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params?.id;
    const { page = 1, limit = 20, status } = req.query;

    const filter = { job: jobId };
    if (status) filter.status = status;

    const applications = await Application.find(filter)
      .populate('user', 'fullName email profile.profilePhoto profile.skills')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Application.countDocuments(filter);

    if (!applications || applications.length === 0) {
      return res.status(404).json({ 
        message: "No applicants found for this job", 
        success: false 
      });
    }

    return res.status(200).json({ 
      success: true, 
      applications,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    return res.status(500).json({
      message: "An error occurred while fetching applicants",
      success: false,
    });
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
