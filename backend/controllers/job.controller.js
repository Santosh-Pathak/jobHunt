import { Job } from "../models/job.model.js";

export const postJob = async (req, res) => {
  try {
    console.log('Received job data:', req.body); // Debug log
    
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position, // Fixed: changed from 'postion' to 'position'
      companyId,
    } = req.body;

    const userId = req.id || req._id;
    if (!userId)
      return res.status(401).json({ message: "Unauthenticated User", success: false });
    
    // Validate required fields
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    )
      return res.status(400).json({
        message: "All fields are required (Some Fields of Job are Missing)",
        success: false
      });

    // Validate jobType enum
    const validJobTypes = ["Full-time", "Part-time", "Internship", "Contract", "Freelance"];
    if (!validJobTypes.includes(jobType)) {
      return res.status(400).json({
        message: `Invalid job type. Must be one of: ${validJobTypes.join(', ')}`,
        success: false
      });
    }

    // Validate experience is numeric
    if (isNaN(experience) || Number(experience) < 0) {
      return res.status(400).json({
        message: "Experience must be a valid number",
        success: false
      });
    }

    // Validate position is numeric and positive
    if (isNaN(position) || Number(position) <= 0) {
      return res.status(400).json({
        message: "Position must be a valid positive number",
        success: false
      });
    }

    // Validate salary is numeric and positive
    if (isNaN(salary) || Number(salary) <= 0) {
      return res.status(400).json({
        message: "Salary must be a valid positive number",
        success: false
      });
    }

    // Generate a unique non-null slug to satisfy unique index
    const slugify = (value) => {
      if (!value) return '';
      return value
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    };

    const baseSlugParts = [slugify(title)];
    if (companyId) {
      // add a short stable suffix to improve uniqueness without leaking full id
      const shortId = companyId.toString().slice(-6);
      baseSlugParts.push(shortId);
    }
    const baseSlug = baseSlugParts.filter(Boolean).join('-');

    let uniqueSlug = baseSlug || `job-${Date.now()}`;
    let attempt = 1;
    // ensure uniqueness by probing existing slugs
    // note: this loop will run very few times in practice
    // guard with a sane upper bound
    while (await Job.exists({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${attempt++}`;
      if (attempt > 50) {
        uniqueSlug = `${baseSlug}-${Date.now()}`;
        break;
      }
    }

    const newJob = await Job.create({
      title,
      description,
      requirement: requirements.split(","), // Fixed: changed from 'requirements' to 'requirement' to match model
      salary: {
        min: Number(salary),
        max: Number(salary) * 1.2, // Set max as 20% higher than min
        currency: 'USD',
        negotiable: false
      },
      location: {
        city: location.split(',')[0]?.trim() || location,
        country: 'India', // Default country
        remote: false,
        hybrid: false
      },
      jobType,
      experienceLevel: Number(experience) || 0,
      position: Number(position) || 1,
      company: companyId,
      createdBy: userId,
      category: 'Technology', // Default category
      industry: 'Technology', // Default industry
      status: 'active',
      slug: uniqueSlug
    });

    return res
      .status(201)
      .json({ newJob, message: "New Job Created Successfully", success: true });
  } catch (error) {
    console.log("Error creating job:", error);
    return res.status(500).json({
      message: "Error creating job",
      success: false,
      error: error.message
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    //Very Important : Pagination Logic for Jobs Listing Page (Backend) - 1 of 2 - 1 of 2 - 1 of 2
    const keyword = req.query.keyword || "";
    const query = {
      title: {
        $regex: keyword,
        $options: "i",
      },
      description: {
        $regex: keyword,
        $options: "i",
      },
    };
    // search for title or description that matches the keyword in the query string and return the results that match the keyword in the title or description field of the job document in the database
    // Here we will use the $regex operator to search for the keyword in the title and description fields of the job document in the database. The $regex operator is used to search for a specified string in a field.
    // here we will use Populate to get the company details of the job as well
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({ message: "No Jobs Found", success: false });
    }

    return res
      .status(200)
      .json({ jobs, message: "JObs Fetched SuccessFully", success: true });
  } catch ({ error }) {
    console.log(error);
  }
};
// THIS WILL BE FOR STUDENT SIDE
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "No Job Found", success: false });
    }
    return res
      .status(200)
      .json({ job, message: "Job Fetched Successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};
// THIS WILL BE FOR COMPANY SIDE (ADMIN WILL HOST THE JOB)(ADMIN NE ABHI TAK KITNE JO HOST KIYE HAI)
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id || req._id;
    if (!adminId) {
      return res.status(401).json({ message: "Unauthenticated User", success: false });
    }
    
    const jobs = await Job.find({ createdBy: adminId }).populate({
      path: "company",
    });
    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: "No Jobs Found", success: false });
    }
    return res
      .status(200)
      .json({ jobs, message: "Jobs Fetched Successfully", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error fetching jobs", success: false });
  }
};

// How Pupulate Works in Mongoose
// The populate() method is used to replace the specified path in the document with document(s)
// from other collection(s). It is used to reference documents in other collections.
// Populate() method is used to fetch the details of the referenced document from the other collection.
// The populate() method is used to replace the specified field in a document with the document from another collection.
// It is used to reference documents in other collections.

export const deleteJob = async (req, res) => {
  const { jobId } = req.body;

  if (!jobId) {
    return res.status(400).json({ message: "Job ID is required" });
  }

  try {
    // Find and delete the job by its ID
    const deletingJob = await Job.findByIdAndDelete(jobId);

    if (!deletingJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    const remainingJobs = await Job.find();

    return res.status(200).json({
      message: "Job deleted successfully",
      remainingJobs,
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({
      message: "Error deleting the job",
      error: error.message,
    });
  }
};
