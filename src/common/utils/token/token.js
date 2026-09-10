import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_USER_SECRET,
  ACCESS_TOKEN_ADMIN_SECRET,
  ACCESS_TOKEN_USER_EXPIRATION,
  ACCESS_TOKEN_ADMIN_EXPIRATION,
  REFRESH_TOKEN_USER_SECRET,
  REFRESH_TOKEN_ADMIN_SECRET,
  REFRESH_TOKEN_USER_EXPIRATION,
  REFRESH_TOKEN_ADMIN_EXPIRATION,
} from "../../../config/config.service.js";
import { roleEnum, signatureEnum } from "../enum/enum.js";

export const generateToken = ({ payload, secretKey, options = {} }) => {
  return jwt.sign(payload, secretKey, options);
};

export const verifyToken = ({ token, secretKey }) => {
  return jwt.verify(token, secretKey);
};

export const getSignature = (signature = signatureEnum.User) => {
  signature.accessSignature = undefined;
  signature.refreshSignature = undefined;

  switch (signature.signatureLevel) {
    case signatureEnum.User:
      signature.accessSignature = ACCESS_TOKEN_USER_SECRET;
      signature.refreshSignature = REFRESH_TOKEN_USER_SECRET;
      break;

    case signatureEnum.Admin:
      signature.accessSignature = ACCESS_TOKEN_ADMIN_SECRET;
      signature.refreshSignature = REFRESH_TOKEN_ADMIN_SECRET;
      break;

    default:
      signature.accessSignature = ACCESS_TOKEN_USER_SECRET;
      signature.refreshSignature = REFRESH_TOKEN_USER_SECRET;
      break;
  }
  return signature;
};

export const getNewCredentials = async (user) => {
  const signature =  getSignature({
    signatureLevel:
      user.role != roleEnum.Admin ? signatureEnum.User : signatureEnum.Admin,
  });


  const accessToken = generateToken({
    payload: { id: user._id },
    secretKey: signature.accessSignature,
    options: {
      expiresIn:
        user.role != roleEnum.Admin
          ? Number(ACCESS_TOKEN_USER_EXPIRATION)
          : Number(ACCESS_TOKEN_ADMIN_EXPIRATION),
    },
  });

  const refreshToken = generateToken({
    payload: { id: user._id },
    secretKey: signature.refreshSignature,
    options: {
      expiresIn:
        user.role != roleEnum.Admin
          ? Number(REFRESH_TOKEN_USER_EXPIRATION)
          : Number(REFRESH_TOKEN_ADMIN_EXPIRATION),
    },
  });

  return { accessToken, refreshToken };
};

export const newAccessToken = async (user) => {
  const signature = getSignature({
    signatureLevel:
      user.role != roleEnum.Admin ? signatureEnum.User : signatureEnum.Admin,
  });

  const accessToken = generateToken({
    payload: { id: user._id },
    secretKey: signature.accessSignature,
    options: {
      expiresIn:
        user.role != roleEnum.Admin
          ? Number(ACCESS_TOKEN_USER_EXPIRATION)
          : Number(ACCESS_TOKEN_ADMIN_EXPIRATION),
    },
  });
  return accessToken;
};