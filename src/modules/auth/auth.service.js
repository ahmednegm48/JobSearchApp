import { OAuth2Client } from "google-auth-library";
import { providerEnum } from "../../common/utils/enum/enum.js";
import { eventEmitter } from "../../common/utils/events/email.event.js";
import {
  badRequestException,
  conflictException,
  notFoundException,
} from "../../common/utils/response/error.response.js";
import { successResponse } from "../../common/utils/response/success.response.js";
import { generateOTP } from "../../common/utils/security/generate.otp.js";
import {
  compareHash,
  generateHash,
} from "../../common/utils/security/hash.security.js";
import {
  getNewCredentials,
  newAccessToken,
} from "../../common/utils/token/token.js";
import userModel from "../../DB/models/user.model.js";
import { del, get, set } from "../../DB/redis/redis.service.js";
import {
  createOne,
  findOne,
  updateOne,
} from "../../DB/repository/database.repository.js";
import { GOOGLE_CLIENT_ID } from "../../config/config.service.js";

export const signup = async (req, res) => {
  const { firstName, lastName, DOB, email, password, mobileNumber } = req.body;
  if (
    await findOne({
      model: userModel,
      filter: { email, deletedAt: { $exists: false } },
    })
  ) {
    throw conflictException({ message: "User already exists" });
  }

  const otp = await generateOTP();

  const hashedOtp = await generateHash({
    plaintext: otp,
  });

  await set({ key: `otp:confirm:${email}`, value: hashedOtp, ttl: 10 * 60 }); // store OTP in Redis with a TTL of 10 minutes

  const user = await createOne({
    model: userModel,
    data: {
      firstName,
      lastName,
      email,
      DOB,
      password,
      mobileNumber,
    },
  });

  eventEmitter.emit("Confirm Email", { to: email, otp });

  successResponse({
    res,
    statusCode: 201,
    message: "User creared successfully",
    data: { user },
  });
};

export const confirmEmail = async (req, res) => {
  const { email, otp } = req.body;

  const user = await findOne({
    model: userModel,
    filter: {
      email,
      isConfirmed: { $exists: false },
      deletedAt: { $exists: false },
    },
  });
  if (!user) {
    throw notFoundException({ message: "User not found" });
  }

  const storedOtp = await get({ key: `otp:confirm:${email}` });
  if (!storedOtp) {
    throw badRequestException({ message: "OTP has expired" });
  }

  const isMatch = await compareHash({
    plaintext: otp,
    ciphertext: storedOtp.slice(1, -1), //slice because the storedOtp is a string with quotes, so we need to remove them before comparing
  });
  if (!isMatch) throw badRequestException({ message: "Invalid OTP" });

  await updateOne({
    model: userModel,
    filter: { email },
    update: {
      isConfirmed: true,
    },
  });

  await del({ key: `otp:confirm:${email}` });

  successResponse({
    res,
    statusCode: 200,
    message: "User Email Has Been Confirmed Successfully",
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await findOne({
    model: userModel,
    filter: {
      email,
      isConfirmed: true,
      provider: providerEnum.System,
      deletedAt: { $exists: false },
    },
  });

  if (!user) {
    throw conflictException({ message: "User not found" });
  }

  const isMatch = await compareHash({
    plaintext: password,
    ciphertext: user.password,
  });
  if (!isMatch) throw badRequestException({ message: "invalid credentials" });

  const tokens = await getNewCredentials(user);

  successResponse({
    res,
    statusCode: 200,
    message: "User logged in successfully",
    data: { tokens },
  });
};

async function verifyGoogleToken(idToken) {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  return payload;
}

export const loginWithGoogle = async (req, res) => {
  const { idToken } = req.body;
  const { email, email_verified, given_name, family_name, picture } =
    await verifyGoogleToken(idToken);
  if (!email_verified)
    throw badRequestException({ message: "Email not verified" });
  const user = await findOne({
    model: userModel,
    filter: { email, deletedAt: { $exists: false } },
  });
  if (user) {
    if (user.provider !== providerEnum.Google) {
      throw badRequestException({
        message: "Email already registered with a different provider",
      });
    }
    const tokens = await getNewCredentials(user);
    return successResponse({
      res,
      statusCode: 200,
      message: "User logged in successfully",
      data: { tokens },
    });
  }

  const newUser = await createOne({
    model: userModel,
    data: {
      firstName: given_name,
      lastName: family_name,
      email,
      provider: providerEnum.Google,
      profilePic: picture,
    },
  });
  const tokens = await getNewCredentials(newUser);
  successResponse({
    res,
    statusCode: 201,
    message: "User created successfully",
    data: { tokens },
  });
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;

  const otp = await generateOTP();
  const hashedOtp = await generateHash({
    plaintext: otp,
  });

  await set({ key: `otp:forget:${email}`, value: hashedOtp, ttl: 10 * 60 });

  eventEmitter.emit("Forget Password", { to: email, otp });

  return successResponse({
    res,
    statusCode: 201,
    message: "OTP has been sent",
  });
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await findOne({
    model: userModel,
    filter: {
      email,
      isConfirmed: true,
      provider: providerEnum.System,
      deletedAt: { $exists: false },
    },
  });
  if (!user) throw notFoundException({ message: "User Not Found" });

  const storedOtp = await get({ key: `otp:forget:${email}` });
  if (!storedOtp) throw badRequestException({ message: "OTP has expired" });

  const isOtpValid = await compareHash({
    plaintext: otp,
    ciphertext: storedOtp.slice(1, -1),
  });

  if (!isOtpValid) throw badRequestException({ message: "Invalid OTP" });

  await updateOne({
    model: userModel,
    filter: { email, deletedAt: { $exists: false } },
    update: {
      password: newPassword,
      changeCredentialsTime: new Date(),
    },
  });

  await del({ key: `otp:forget:${email}` });

  return successResponse({
    res,
    statusCode: 201,
    message: "Password Reset Successfully",
  });
};

export const refreshToken = async (req, res) => {
  //checked in the authentication middleware that the refresh token is valid within the allowed time(after Change Credentials Time)
  // so we can safely issue a new access token
  const tokens = await newAccessToken(req.user);
  successResponse({
    res,
    statusCode: 200,
    message: "Tokens refreshed successfully",
    data: { tokens },
  });
};

/*
## Task scheduling

1. **CRON Job for Deleting Expired OTP Codes (2 Grades)**
    - **Runs every 6 hours** to delete expired OTPs from the database.

    we dont need to delete the OTPs from the database because we are storing them in Redis with a TTL of 10 minutes
    so they will be automatically deleted after that time. or after one use
*/
