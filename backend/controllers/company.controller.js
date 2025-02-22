import express from "express";
import Company from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
  try {
    const companyName = req.body;
    if (!companyName) {
      return res
        .status(400)
        .json({ msg: "Company name is required.", success: false });
    }
  
    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res
        .status(400)
        .json({ msg: "Company already exists.", success: false });
    }

    company = await Company.create({
      name: companyName,
      userId: req?._id,
    });
    await company.save();

    return res.status(200).json({
      msg: "Company registered successfully.",
      success: true,
      company,
    });
  } catch (error) {
    console.log(error);
  }
};
// whe any Student will Be logged IN so he can see the List of Companies he has registered
// Or when th recruiter will be logged in he can see the list of Companies ha has Created
export const getCompanies = async (req, res) => {
  try {
    const userId = req?._id; // logged in user id from token
    const companies = await Company.find({ userId });
    if (!companies) {
      return res
        .status(404)
        .json({ message: "Companies not found.", success: false });
    }

    return res.status(200).json({
      companies,
      success: true,
      message: "Companies found.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// get company by id
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById({ companyId });
    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found.", success: false });
    }
    return res.status(200).json({
      company,
      success: true,
      message: "Company found.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Udpate COmpany Details
 export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const updatedData = { name, description, website, location };
    //LOgo will be updated later on
    if (req.file) {

      const file = req.file;
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      const logo = cloudResponse.secure_url;

      updatedData.logo = logo;
  }
    //Cloudinary will be used for the same
    const companyId = req.params.id;
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      updatedData,
      {
        new: true,
      }
    );
    if (!updatedCompany) {
      return res
        .status(404)
        .json({ message: "Company not found.", success: false });
    }

    return res.status(200).json({
      updatedCompany,
      success: true,
      message: "Company Imformation updated.",
      success: true,
    });

    
  } catch (error) {
    console.log(error);
  }
};

// import { createCompany, getCompanies, getCompany, updateCompany, deleteCompany } from '../controllers/company.controller.js';
// delete a company by admin 

export const deleteCompany = async(req, res) => {
  const { companyId } = req.body;
  const userId = req.id

  if (!userId) {
      return res.status(400).json({
          message: "User is not authneticated.",
          success: false
      });
  }
  if (!companyId) {
      return res.status(400).json({
          message: "User is not authneticated.",
          success: false
      });
  }

}