import {
  conflictException,
  notFoundException,
  unauthorizedException,
} from "../../common/utils/response/error.response.js";
import { successResponse } from "../../common/utils/response/success.response.js";
import companyModel from "../../DB/models/company.model.js";
import { createOne, findByIdAndUpdate, findOne } from "../../DB/repository/database.repository.js";

export const createCompany = async (req, res) => {
  const { companyName, description, companyEmail, industry, address } =
    req.body;
  const isNameExist = await findOne({
    model: companyModel,
    filter: { companyName, deletedAt: { $exists: false } },
  });
  if (isNameExist) throw conflictException("Company Name Already Exist");
  const isEmailExist = await findOne({
    model: companyModel,
    filter: { companyEmail, deletedAt: { $exists: false } },
  });
  if (isEmailExist) throw conflictException("Company Email Already Exist");
  const company = await createOne({
    model: companyModel,
    data: {
      companyName,
      description,
      companyEmail,
      industry,
      address,
      CreatedBy: req.user._id,
    },
  });

  successResponse({
    res,
    statusCode: 201,
    message: "Company created successfully",
    data: { company },
  });
};

export const updateCompany = async (req, res) => {
  const { companyName, companyEmail, industry, address, description } =
    req.body;
  const { companyId } = req.params;
  const { user } = req;
  const company = await findOne({
    model: companyModel,
    filter: { _id: companyId, deletedAt: { $exists: false } },
  });
  if (!company) throw notFoundException("Company Not Found");
  if (user._id.toString() !== company.CreatedBy.toString())
    throw unauthorizedException("Unauthorized to update this company");

  if(companyName && companyName !== company.companyName) {
    const isNameExist = await findOne({
    model: companyModel,
    filter: { companyName, deletedAt: { $exists: false } },
  });
  if (isNameExist) throw conflictException("Company Name Already Exist");
    company.companyName = companyName;
  }
  if(companyName && companyName !== company.companyName) {
    const isEmailExist = await findOne({
    model: companyModel,
    filter: { companyEmail, deletedAt: { $exists: false } },
  });
  if (isEmailExist) throw conflictException("Company Email Already Exist");
    company.companyEmail = companyEmail;
  }

  if (industry) company.industry = industry;
  if (address) company.address = address;
  if (description) company.description = description;
  await company.save();

  successResponse({
    res,
    statusCode: 201,
    message: "Company updated successfully",
    data: { company },
  });
};

export const softDelete = async (req, res) => {
  const { companyId } = req.params;
  const results = await findByIdAndUpdate({
    model: companyModel,
    id: companyId,
    update: { deletedAt: new Date() },
  });
  if (!results) throw notFoundException("Company Not Found");

  return successResponse({
    res,
    statusCode: 200,
    message: "Company Deleted Successfully",
  });
}
