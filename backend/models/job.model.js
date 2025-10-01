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
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: 'USD'
      },
      negotiable: {
        type: Boolean,
        default: false
      }
    },
    location: {
      city: {
        type: String,
        required: true,
      },
      state: String,
      country: {
        type: String,
        required: true,
      },
      remote: {
        type: Boolean,
        default: false
      },
      hybrid: {
        type: Boolean,
        default: false
      }
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract", "Freelance"],
      required: true,
    },
    position: {
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
    // Enhanced job fields
    category: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    skills: [{
      type: String
    }],
    benefits: [{
      type: String
    }],
    perks: [{
      type: String
    }],
    workingHours: {
      start: String,
      end: String,
      timezone: String
    },
    applicationDeadline: {
      type: Date
    },
    startDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'closed', 'draft'],
      default: 'active'
    },
    featured: {
      type: Boolean,
      default: false
    },
    urgent: {
      type: Boolean,
      default: false
    },
    views: {
      type: Number,
      default: 0
    },
    applicationsCount: {
      type: Number,
      default: 0
    },
    tags: [{
      type: String
    }],
    requirements: {
      education: {
        type: String,
        enum: ['High School', 'Bachelor', 'Master', 'PhD', 'Any']
      },
      experience: {
        min: Number,
        max: Number
      },
      languages: [{
        language: String,
        proficiency: String
      }]
    },
    // SEO and metadata
    slug: {
      type: String,
      unique: true
    },
    metaDescription: String,
    keywords: [String]
  },
  { timestamps: true }
);

// Create index for better search performance
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });
jobSchema.index({ location: 1, jobType: 1, category: 1 });
jobSchema.index({ salary: 1, experienceLevel: 1 });

export const Job = mongoose.model("Job", jobSchema);
