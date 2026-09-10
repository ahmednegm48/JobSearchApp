import joi from "joi";
import { generalFields } from "../../common/middleware/validation.js";

export const createCompanySchema = {
  body: joi.object({
    companyName:generalFields.companyName.required(),
    description:generalFields.description,
    companyEmail:generalFields.companyEmail.required(),
    industry:generalFields.industry,
    address:generalFields.address
  })
}

export const updateCompanySchema = {
  body: joi.object({
    companyName:generalFields.companyName,
    companyEmail:generalFields.companyEmail,
    description:generalFields.description,
    industry:generalFields.industry,
    address:generalFields.address
  })
}

export const softDeleteSchema = {
  params:joi.object({
    companyId:generalFields.id,
  })
}

