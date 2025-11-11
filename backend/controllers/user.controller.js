/**
 * User Controller - Integrated with Auth & Notification Microservices
 * 
 * This controller uses:
 * - Auth microservice for user authentication
 * - Notification microservice for emails
 * - Event bus (RabbitMQ) for event publishing
 */

import bcrypt from "bcryptjs";
import {User} from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import authService from "../services/authService.js";
import notificationService from "../services/notificationService.js";
import eventPublisher from "../services/eventPublisher.js";

dotenv.config();

export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;
    const file = req.file;
    
    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    // Check if user already exists in JobHunt database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists", success: false });
    }

    // Handle profile picture upload to Cloudinary
    let profilePhoto = "";
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhoto = cloudResponse.secure_url;
    }

    // Register user with Auth microservice
    console.log('Registering user with Auth microservice...');
    const authResult = await authService.register({
      fullName,
      email,
      phoneNumber,
      password,
      role,
      profile: { profilePhoto }
    });

    if (!authResult.success) {
      return res.status(authResult.statusCode || 400).json({
        message: authResult.error || "Registration failed",
        success: false
      });
    }

    // Create JobHunt user profile in local database
    const jobHuntUser = await User.create({
      fullName,
      email,
      phoneNumber,
      password: await bcrypt.hash(password, 10), // Store hashed password for fallback
      role,
      authUserId: authResult.user.authUserId, // Link to Auth microservice user
      profile: {
        profilePhoto: profilePhoto,
        bio: "",
        skills: [],
        resume: "",
        education: [],
        experience: [],
        portfolio: [],
        certifications: [],
        languages: [],
        socialLinks: {},
        preferences: {
          jobTypes: [],
          locations: [],
          salaryRange: { min: 0, max: 0 },
          remoteOnly: false,
          willingToRelocate: false
        },
        savedJobs: []
      },
      analytics: {
        profileViews: 0,
        jobApplications: 0,
        profileCompleteness: 20 // Initial completeness
      }
    });

    // Send welcome email via Notification microservice
    console.log('Sending welcome email...');
    await notificationService.sendWelcomeEmail({
      email: jobHuntUser.email,
      fullName: jobHuntUser.fullName,
      firstName: fullName.split(' ')[0],
      role: jobHuntUser.role,
      _id: jobHuntUser._id
    });

    // Publish user.registered event
    console.log('Publishing user.registered event...');
    await eventPublisher.publishApplicationSubmitted({
      _id: jobHuntUser._id,
      email: jobHuntUser.email,
      fullName: jobHuntUser.fullName,
      role: jobHuntUser.role,
      createdAt: jobHuntUser.createdAt
    });

    // Return response with tokens from Auth microservice
    return res.status(201).json({ 
      message: "Account created successfully", 
      success: true,
      user: {
        _id: jobHuntUser._id,
        authUserId: jobHuntUser.authUserId,
        fullName: jobHuntUser.fullName,
        email: jobHuntUser.email,
        phoneNumber: jobHuntUser.phoneNumber,
        role: jobHuntUser.role,
        profile: jobHuntUser.profile
      },
      tokens: authResult.tokens
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: "Something went wrong during registration", success: false });
  }
};

export const login = async (req, res) => {
  try {
      const { email, password, role } = req.body;
      console.log("Login attempt for:", email, "Role:", role);
      
      if (!email || !password || !role) {
          console.log("Missing fields:", { email: !!email, password: !!password, role: !!role });
          return res.status(400).json({
              message: "Something is missing",
              success: false
          });
      };
      // Authenticate with Auth microservice
      console.log('Authenticating with Auth microservice...');
      const authResult = await authService.login({ email, password });

      if (!authResult.success) {
          return res.status(authResult.statusCode || 400).json({
              message: authResult.error || "Incorrect email or password",
              success: false
          });
      }

      // Get JobHunt user profile
      console.log('Looking for JobHunt user profile...');
      let user = await User.findOne({ email }).select('-password');
      
      if (!user) {
          // User exists in Auth but not in JobHunt DB
          console.log('User not found in JobHunt database, creating profile...');
          user = await User.create({
              fullName: authResult.user.fullName,
              email: authResult.user.email,
              phoneNumber: "",
              authUserId: authResult.user.authUserId,
              role: role,
              profile: { profilePhoto: "", bio: "", skills: [], savedJobs: [] },
              analytics: { profileViews: 0, jobApplications: 0, profileCompleteness: 10 }
          });
      }

      // Check role matches
      if (role !== user.role) {
          console.log('Role mismatch:', { expected: role, actual: user.role });
          return res.status(403).json({
              message: `You are not authorized to login as ${role}`,
              success: false
          });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Set token in cookie (for backward compatibility)
      const token = authResult.tokens.accessToken;
      return res.status(200).cookie("token", token, {
          maxAge: 1 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: 'lax',
          secure: false
      }).json({
          message: `Welcome back ${user.fullName}`,
          user,
          tokens: authResult.tokens,
          success: true
      })
  } catch (error) {
      console.log("ERROR while Login");
      console.log(error);
      return res.status(500).json({
          message: "Something went wrong during login",
          success: false
      });
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    // if (!fullName || !email || !phoneNumber || !bio || !skills) {
    //   return res.status(400).json({ message: "All fields are required" });
    //   success: false;
    // }
    //Cloudinary Upload ayega Idhar

    let cloudResponse = null
    if (file) {
        const fileUri = getDataUri(file);
        cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    }



    let skillsArray = [];
    if(skills)
    {
      skillsArray= skills.split(",");

    }

    const userId = req.id; // middleware Authentication
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
      success: false;
    }

    //Updating the Daaaata
    if(fullName)user.fullName = fullName;
    if(email)user.email = email;
    if(phoneNumber)user.phoneNumber = phoneNumber;
    if(bio)user.bio = bio;
    if(skills)user.profile.skills = skillsArray;

    // Handle resume upload
    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    //
    await user.save();
    // New User Object created
    user = {
      _id: user?._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .json({ message: "Profile Updated Successfully", user, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const LogOut = async (req, res) => {
  try {
    console.log("Logout request received");
    
    // Clear the cookie with proper settings
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // Set to false for development
      path: '/' // Ensure cookie is cleared from all paths
    });
    
    console.log("Cookie cleared successfully");
    
    return res.status(200).json({ 
      message: "Logout Successfully",
      success: true 
    });
  } catch (error) {
    console.log("Logout error:", error);
    return res.status(500).json({ 
      message: "Can't Logout",
      success: false 
    });
  }
};


export const savedJobs = async(req, res) => {
  try {
      const { jobId } = req.body;
      const userId = req.id;

      let user = await User.findById(userId)
      if (!user) {
          return res.status(404).json({
              message: "User not found",
              success: false
          })
      }

      if (user.profile.savedJobs.includes(jobId)) {
          return res.status(400).json({
              message: "Job is already saved",
              success: false
          })
      }

      user.profile.savedJobs.push(jobId);
      await user.save()

      await user.populate('profile.savedJobs');
      return res.status(200).json({
          user,
          message: "Job saved successfully",
          success: true,
          savedJobs: user.profile.savedJobs
      });

  } catch (error) {
      console.error(error);
      return res.status(500).json({
          message: "An error occurred",
          error: error.message,
          success: false
      });

  }
}