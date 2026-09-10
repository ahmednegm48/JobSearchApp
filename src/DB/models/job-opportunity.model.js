import mongoose from "mongoose";
import {
  jobLocationEnum,
  seniorityLevelEnum,
  workingTimeEnum,
} from "../../common/utils/enum/enum.js";

const jobOpportunitySchema = new mongoose.Schema(
  {
    jobTitle: String,
    jobLocation: {
      type: String,
      enum: Object.values(jobLocationEnum),
      default: jobLocationEnum.onsite,
    },
    workingTime: {
      type: String,
      enum: Object.values(workingTimeEnum),
      default: workingTimeEnum.full,
    },
    seniorityLevel: {
      type: String,
      enum: Object.values(seniorityLevelEnum),
      default: seniorityLevelEnum.fresh,
    },
    jobDescription: String,
    technicalSkills: [String],
    softSkills: [String],
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: isAddedByHR,
        message: "addedBy must be an HR of the specified company",
      },
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      validate: {
        validator: isAddedByHR,
        message: "addedBy must be an HR of the specified company",
      },
    },
    closed: Boolean,
    companyId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
  },
  {
    timestamps: true,
  },
);

const isAddedByHR = async function (userId) {
  const Company = mongoose.model("Company");
  const companies = await Company.find({
    _id: { $in: this.companyId },
  });
  return companies.some((c) => c.HRs.some((hrId) => hrId.equals(userId)));
};

const jobOpportunityModel = mongoose.model(
  "JobOpportunity",
  jobOpportunitySchema,
);
export default jobOpportunityModel;
