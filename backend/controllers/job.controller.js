import Job from "../models/job.model.js";

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      postion,
      companyId,
    } = req.body;

    const userId = req.id;
    if (!userId)
      return res.status(401).json({ message: "Unauthenticated USer" });
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !postion ||
      !companyId
    )
      return res.status(400).json({
        message: "All fields are required (Some Fields of Job are Missing)",
      });

    const newJob = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      postion,
      company: companyId,
      createdBy: userId,
    });

    return res
      .status(201)
      .json({ newJob, message: "New Job Created Successfully", success: true });
  } catch (error) {
    console.log(error);
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
    const adminId = req.id;
    const jobs = await Job.findById({ createdBy: adminId });
    if (!jobs) {
      return res.status(404).json({ message: "No Jobs Found", success: false });
    }
    return res
      .status(200)
      .json({ jobs, message: "Jobs Fetched Successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

// How Pupulate Works in Mongoose
// The populate() method is used to replace the specified path in the document with document(s)
// from other collection(s). It is used to reference documents in other collections.
// Populate() method is used to fetch the details of the referenced document from the other collection.
// The populate() method is used to replace the specified field in a document with the document from another collection.
// It is used to reference documents in other collections.
