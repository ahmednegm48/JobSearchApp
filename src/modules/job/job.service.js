import {
  notFoundException,
  unauthorizedException,
} from "../../common/utils/response/error.response.js";
import { successResponse } from "../../common/utils/response/success.response.js";
import companyModel from "../../DB/models/company.model.js";
import jobOpportunityModel from "../../DB/models/job-opportunity.model.js";
import { createOne, findOne } from "../../DB/repository/database.repository.js";

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

/*
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: isAddedByHR,
        message: "addedBy must be an HR of the specified company",
      },
    },
    companyId: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    ],
*/
