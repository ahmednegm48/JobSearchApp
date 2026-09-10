import { notFoundException } from "../../common/utils/response/error.response.js";
import { successResponse } from "../../common/utils/response/success.response.js";
import { compareHash } from "../../common/utils/security/hash.security.js";
import userModel from "../../DB/models/user.model.js";
import {
  findByIdAndUpdate,
  findOneAndUpdate,
  updateOne,
} from "../../DB/repository/database.repository.js";

export const updateAccount = async (req, res) => {
  const { mobileNumber, DOB, firstName, lastName, gender, password } = req.body;
  const { user } = req;
  if (!password)
    throw notFoundException("Password is required to update account");
  const passwordMatch = await compareHash({
    plaintext: password,
    ciphertext: user.password,
  });
  if (!passwordMatch) throw notFoundException("Invalid password");

  if (mobileNumber) user.mobileNumber = mobileNumber;
  if (DOB) user.DOB = DOB;
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (gender) user.gender = gender;

  await user.save();

  successResponse({
    res,
    statusCode: 201,
    message: "User profile updated successfully",
    data: { user },
  });
};

export const getProfile = async (req, res) => {
  const { user } = req;

  successResponse({
    res,
    statusCode: 200,
    message: "User profile fetched successfully",
    data: { user },
  });
};

export const getpublicProfile = async (req, res) => {
  const { userId } = req.params;

  const userData = await userModel
    .findOne({ _id: userId, deletedAt: { $exists: false } })
    .select("firstName lastName userName mobileNumber profilePic coverPic ");
  if (!userData) throw notFoundException("User Not Found");
  // select first and last name and remove them just to show the userName instead of first and last name in the response
  const user = userData.toObject();
  delete user.firstName;
  delete user.lastName;
  successResponse({
    res,
    statusCode: 200,
    message: "User profile fetched successfully",
    data: { user },
  });
};

export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const isPasswordValid = await compareHash({
    plaintext: oldPassword,
    ciphertext: req.user.password,
  });

  if (!isPasswordValid) throw badRequestException("Wrong Password");

  await updateOne({
    model: userModel,
    filter: { _id: req.user._id , deletedAt:{$exists:false}},
    update: {
      password: newPassword,
    },
  });

  return successResponse({
    res,
    statusCode: 201,
    message: "Password Changed Successfully",
  });
};

export const updateProfilePic = async (req, res) => {
  const user = await findByIdAndUpdate({
    model: userModel,
    id: req.user.id,
    update: { profilePic: req.file.finalPath },
  });

  if (!req.file) {
    throw notFoundException("File not found");
  }

  successResponse({
    res,
    statusCode: 200,
    message: "Profile picture updated successfully",
    data: { user },
  });
};

export const uploadCoverPic = async (req, res) => {
  const user = await findByIdAndUpdate({
    model: userModel,
    id: req.user.id,
    update: { coverPictures: req.files.finalPath },
  });

  if (!req.file) {
    throw notFoundException("File not found");
  }

  successResponse({
    res,
    statusCode: 200,
    message: "Cover picture updated successfully",
    data: { user },
  });
};

export const deleteProfilePic = async (req, res) => {
  const user = await findOneAndUpdate({
    model: userModel,
    filter: { _id: req.user.id, deletedAt: { $exists: false } },
    update: { profilePic: null },
  });

  if (!user) throw notFoundException("User Not Found");

  return successResponse({
    res,
    statusCode: 200,
    message: "Profile Picture Deleted Successfully",
  });
}

export const deleteCoverPic = async (req, res) => {
  const user = await findOneAndUpdate({
    model: userModel,
    filter: { _id: req.user.id, deletedAt: { $exists: false } },
    update: { coverPic: null },
  });

  if (!user) throw notFoundException("User Not Found");

  return successResponse({
    res,
    statusCode: 200,
    message: "Cover Picture Deleted Successfully",
  });
}

export const softDelete = async (req, res) => {
  const { userId } = req.params;
  const results = await findByIdAndUpdate({
    model: userModel,
    id: userId,
    update: { deletedAt: new Date() },
  });
  if (!results) throw notFoundException("Account Not Found");

  return successResponse({
    res,
    statusCode: 200,
    message: "Account Deleted Successfully",
  });
}
