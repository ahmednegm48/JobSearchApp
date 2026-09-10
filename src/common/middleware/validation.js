import { Types } from "mongoose";
import { badRequestException } from "../utils/response/error.response.js";
import joi from "joi";
import { genderEnum, providerEnum, roleEnum } from "../utils/enum/enum.js";

const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

export const generalFields = {
  firstName: joi.string().min(2).max(25).messages({
    "any.required": "First Name is required",
    "string.min": "First Name must be at least 2 character long",
    "string.max": "First Name must be at most 25 character long",
  }),
  lastName: joi.string().min(2).max(25).messages({
    "any.required": "Last Name is required",
    "string.min": "Last Name must be at least 2 character long",
    "string.max": "Last Name must be at most 25 character long",
  }),
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 5,
      tlds: { allow: ["com", "net", "org"] },
    }),
  password: joi.string().required(),
  DOB: joi.date().iso().max(eighteenYearsAgo).messages({
    'date.max': 'You must be at least 18 years old to sign up',
  }),
  confirmEmail: joi.string().isoDate(),
  mobileNumber: joi.string().pattern(/^(\+20|020|0)?1[0125][0-9]{8}$/), //egyption phone numbers format
  id: joi.string().custom((value, helper) => {
    return (
      Types.ObjectId.isValid(value) || helper.message("Invalid ObjecID Format")
    );
  }),
  gender: joi.string().valid(...Object.values(genderEnum)),
  role: joi.string().valid(...Object.values(roleEnum)),
  provider: joi.string().valid(...Object.values(providerEnum)),
  profilePic: joi.string(),
  coverPic: joi.string(),
};

export const validation = (schema) => {
  return (req, res, next) => {
    const validationError = [];
    for (const key of Object.keys(schema)) {
      const validationResults = schema[key].validate(req[key], {
        abortEarly: false,
      });
      if (validationResults.error)
        validationError.push({ key, details: validationResults.error.details });
      if (validationError.length)
        throw badRequestException("Validation Error", validationError);
      return next();
    }
  };
};