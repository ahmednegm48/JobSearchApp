import joi from "joi";
import { generalFields } from "../../common/middleware/validation.js";

export const signupSchema = {
    body: joi.object({
    firstName: generalFields.firstName.required(),
    lastName: generalFields.lastName.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    DOB: generalFields.DOB,
    mobileNumber: generalFields.mobileNumber,
    gender: generalFields.gender,
    role: generalFields.role,
    provider: generalFields.provider,
    profilePic: generalFields.profilePic,
    coverPic: generalFields.coverPic,
  }),
}

export const loginSchema = {
  body: joi.object({
    email:generalFields.email.required(),
    password:generalFields.password
  }),
};

export const confirmEmailSchema = {
  body:joi.object({
    email:generalFields.email.required(),
    otp:joi.string().pattern(/^\d{6}$/),
  })
}

export const forgetPasswordSchema = {
  body:joi.object({
    email:generalFields.email.required(),
  })
}

export const resetPasswordSchema = {
  body:joi.object({
    email:generalFields.email.required(),
    otp:joi.string().pattern(/^\d{6}$/),
    newPassword: generalFields.password,
    confirmPassword: joi.ref("newPassword"),
  })
}