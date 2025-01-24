import mongoose from "mongoose";
const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirement: [
      {
        type: String,
      },
    ],
    experienceLevel: {
      type: Number,
      required: true,
    },

    salary: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship"],
      required: true,
    },
    position:{
        type: Number,
        required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application",
            },
    ],

  },

  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
