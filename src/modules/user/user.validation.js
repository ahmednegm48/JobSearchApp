import joi from "joi";
import { generalFields } from "../../common/middleware/validation.js";

export const updateAccountSchema = {
  body:joi.object({
    password:generalFields.password,
    mobileNumber:generalFields.mobileNumber,
    DOB:generalFields.DOB,
    firstName:generalFields.firstName,
    lastName:generalFields.lastName,
    gender:generalFields.gender,
  })
}

export const updatePasswordSchema = {
  body:joi.object({
    oldPassword:generalFields.password,
    newPassword:generalFields.password,
    confirmPassword:joi.ref("newPassword"),
  })
}

export const getpublicProfileSchema = {
  params:joi.object({
    userId:generalFields.id,
  })
}

export const softDeleteSchema = {
  params:joi.object({
    userId:generalFields.id,
  })
}