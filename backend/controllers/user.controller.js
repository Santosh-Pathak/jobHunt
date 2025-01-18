import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;
    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
      success: false;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
      success: false;
    }

    const hashedPassword = await bcrypt.hash(password, 10); // hashing password wit 10 rounds

    const user = await new User({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    await user.save();
    return res.status(201).json({ message: "Account Created successfully" });
    success: true;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
    success: false;
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
      success: false;
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Emial/Credentails" });
      success: false;
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password); // compare password with hashed password in db
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Emial/PassWord" });
      success: false;
    }
    // check role is correct or not
    if (user.role !== role) {
      return res
        .status(400)
        .json({ message: "Account does't Exist with current Role" });
      success: false;
    }

    const toekenData = { userId: user?._id };
    const token = await jwt.sign(toekenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

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
      .cookie("token", {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({ message: `Welcome Back ${user.fullName}`, token });
    success: true;
  } catch (error) {
    res.status(500).json({ message: "Something went while LOgin " });
    success: false;
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
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    if (!fullName || !email || !phoneNumber || !bio || !skills) {
      return res.status(400).json({ message: "All fields are required" });
      success: false;
    }
    //Cloudinary Upload ayega Idhar

    const skillsArray = skills.split(",");
    const userId = req.id; // middleware Authentication
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
      success: false;
    }

    //Updating the Daaaata
    user.fullName = fullName;
    user.email = email;
    user.phoneNumber = phoneNumber;
    user.bio = bio;
    user.profile.skills = skillsArray;

    // Resume comes later here......

    //

    // Saving the Data
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
