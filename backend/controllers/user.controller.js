import bcrypt from "bcryptjs";
import {User} from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
dotenv.config();

export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;
    const file = req.file;
    
    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // hashing password with 10 rounds

    // Handle profile picture upload
    let profilePhoto = "";
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhoto = cloudResponse.secure_url;
    }

    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: profilePhoto
      }
    });

    return res.status(201).json({ 
      message: "Account created successfully", 
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong", success: false });
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
      console.log("Looking for user with email:", email);
      let user = await User.findOne({ email });
      console.log("User found:", !!user);
      
      if (!user) {
          console.log("User not found");
          return res.status(400).json({
              message: "Incorrect email or password.",
              success: false,
          })
      }
      
      console.log("Comparing password...");
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      console.log("Password match:", isPasswordMatch);
      
      if (!isPasswordMatch) {
          console.log("Password doesn't match");
          return res.status(400).json({
              message: "Incorrect email or password.",
              success: false,
          })
      };
      
      console.log("Checking role. Expected:", role, "User role:", user.role);
      // check role is correct or not
      if (role !== user.role) {
          console.log("Role mismatch");
          return res.status(400).json({
              message: "Account doesn't exist with current role.",
              success: false
          })
      };

      const tokenData = {
          userId: user._id
      }
      
      console.log("Creating JWT token...");
      const secretKey = process.env.SECRET_KEY || 'fallback_secret_key_for_development';
      console.log("Secret key exists:", !!process.env.SECRET_KEY);
      
      const token = jwt.sign(tokenData, secretKey, { expiresIn: '1d' });
      console.log("Token created successfully");

      user = {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          profile: user.profile
      }

      console.log("Sending login response...");
      return res.status(200).cookie("token", token, { 
          maxAge: 1 * 24 * 60 * 60 * 1000, 
          httpOnly: true, 
          sameSite: 'lax',
          secure: false // Set to false for development
      }).json({
          message: `Welcome back ${user.fullName}`,
          user,
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