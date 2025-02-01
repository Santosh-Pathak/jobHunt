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
    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // hashing password with 10 rounds

    await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({ message: "Account created successfully", success: true });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong", success: false });
  }
};

export const login = async (req, res) => {
  try {
      const { email, password, role } = req.body;
      
      if (!email || !password || !role) {
          return res.status(400).json({
              message: "Something is missing",
              success: false
          });
      };
      let user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({
              message: "Incorrect email or password.",
              success: false,
          })
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
          return res.status(400).json({
              message: "Incorrect email or password.",
              success: false,
          })
      };
      // check role is correct or not
      if (role !== user.role) {
          return res.status(400).json({
              message: "Account doesn't exist with current role.",
              success: false
          })
      };

      const tokenData = {
          userId: user._id
      }
      const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

      user = {
          _id: user._id,
          fullname: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          profile: user.profile
      }

      return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
          message: `Welcome back ${user.fullname}`,
          user,
          success: true
      })
  } catch (error) {
      console.log("ERROR while Login");
      console.log(error);
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

    // Resume comes later here......

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
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 }) // clear cookie
      .json({ message: "Logout Successfully" });
    success: true;
  } catch (error) {
    return res.status(500).json({ message: "Can't Logout" });
    console.log(error);
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