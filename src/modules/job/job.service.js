import {
  notFoundException,
  unauthorizedException,
} from "../../common/utils/response/error.response.js";
import { successResponse } from "../../common/utils/response/success.response.js";
import applicationModel from "../../DB/models/application.model.js";
import companyModel from "../../DB/models/company.model.js";
import jobOpportunityModel from "../../DB/models/job-opportunity.model.js";
import {
  createOne,
  findByIdAndDelete,
  findOne,
} from "../../DB/repository/database.repository.js";

export const addJob = async (req, res) => {
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;
  const { companyId } = req.params;
  const { user } = req;
  const company = await findOne({
    model: companyModel,
    filter: { _id: companyId, deletedAt: { $exists: false } },
  });
  if (!company) throw notFoundException("Company Not Found");
  if (
    company.HRs.some((hrId) => hrId.equals(user._id)) ||
    company.CreatedBy.toString() !== user._id.toString()
  ) {
    throw unauthorizedException("Unauthorized to add job for this company");
  }
  const job = await createOne({
    model: jobOpportunityModel,
    data: {
      jobTitle,
      jobLocation,
      workingTime,
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
      addedBy: user._id,
      companyId: companyId,
    },
  });

  successResponse({
    res,
    statusCode: 201,
    message: "Job added successfully",
    data: { job },
  });
};

export const updateJob = async (req, res) => {
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    closed,
  } = req.body;
  const { jobId } = req.params;
  const userId = req.user._id;

  const job = await findOne({
    model: jobOpportunityModel,
    filter: { _id: jobId, closed: false },
    populate: { path: "companyId", select: "CreatedBy" },
  });
  if (!job) throw notFoundException("Job is Not Found");

  if (job.companyId.CreatedBy.toString() !== userId.toString()) {
    throw unauthorizedException("only owner can update this job");
  }
  if (jobTitle) job.jobTitle = jobTitle;
  if (jobLocation) job.jobLocation = jobLocation;
  if (workingTime) job.workingTime = workingTime;
  if (seniorityLevel) job.seniorityLevel = seniorityLevel;
  if (jobDescription) job.jobDescription = jobDescription;
  if (technicalSkills) job.technicalSkills = technicalSkills;
  if (softSkills) job.softSkills = softSkills;
  if (closed) job.closed = closed;

  await job.save();

  successResponse({
    res,
    statusCode: 201,
    message: "Job updated successfully",
    data: { job },
  });
};

export const deleteJob = async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user._id;

  const job = await findOne({
    model: jobOpportunityModel,
    filter: { _id: jobId },
    populate: { path: "companyId", select: "HRs" },
  });
  if (!job) throw notFoundException("Job is Not Found");
  const HRs = job.companyId.HRs;
  if (!HRs.includes(userId))
    throw unauthorizedException("only HRs of this company can delete this job");

  await findByIdAndDelete({
    model: jobOpportunityModel,
    id: jobId,
  });

  successResponse({
    res,
    statusCode: 201,
    message: "Job deleted successfully",
  });
};

export const filteredJobs = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = req.query;
  const skip = (page - 1) * limit;

  const filter = { closed: false };

  if (workingTime) filter.workingTime = workingTime;
  if (jobLocation) filter.jobLocation = jobLocation;
  if (seniorityLevel) filter.seniorityLevel = seniorityLevel;

  if (jobTitle) {
    filter.jobTitle = { $regex: jobTitle };
  }
  if (technicalSkills) {
    const skills = Array.isArray(technicalSkills)
      ? technicalSkills
      : technicalSkills.split(",").map((s) => s.trim());
    filter.technicalSkills = { $in: skills };
  }

  const [jobs, totalJobs] = await Promise.all([
    jobOpportunityModel
      .find(filter)
      .populate("companyId", "companyName")
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit)),
    jobOpportunityModel.countDocuments(filter),
  ]);

  return successResponse({
    res,
    statusCode: 200,
    message: "Jobs Retrived Successfully",
    data: {
      jobs,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalJobs / limit),
        totalJobs,
      },
    },
  });
};

export const getApplication = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { jobId } = req.params;
  const userId  = req.user._id;
  const skip = (page - 1) * limit;

  const [applications, totalApplications] = await Promise.all([
      applicationModel
      .find({jobId})
      .populate('user job', '-password -__v')
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit)),
      applicationModel.countDocuments(jobId),
    ]);

    const companyId = applications[0].job[0].companyId;
    
    
    const company = await findOne({
      model: companyModel,
      filter: { _id: companyId },
    });
    if (!company) throw notFoundException("Company Not Found");    
    if (
      !company.HRs.some((hrId) => hrId.equals(userId)) ||
      company.CreatedBy.toString() !== userId.toString()
    ) {
      throw unauthorizedException("Unauthorized to view job application");
    }

  return successResponse({
    res,
    statusCode: 200,
    message: "Applications Retrived Successfully",
    data: {
      applications,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalApplications / limit),
        totalApplications,
      },
    },
  });

};
