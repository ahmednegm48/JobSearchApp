import userModel from "../../DB/models/user.model.js";
import { get, revokeTokenKey } from "../../DB/redis/redis.service.js";
import { findById } from "../../DB/repository/database.repository.js";
import { signatureEnum, tokenTypeEnum } from "../utils/enum/enum.js";
import {
  forbiddenException,
  notFoundException,
  unauthorizedException,
} from "../utils/response/error.response.js";
import { getSignature, verifyToken } from "../utils/token/token.js";

export const decodeToken = async ({
  authorization,
  tokenType = tokenTypeEnum.Access,
}) => {
  const [Bearer, token] = authorization.split(" ") || [];
  const signatureLevel =
    Bearer === "ADMIN"
      ? signatureEnum.Admin
      : Bearer === "USER"
        ? signatureEnum.User
        : -1;
  if (signatureLevel === -1) throw new Error("Invalid Bearer token");

  let signature = getSignature({
    signatureLevel: signatureLevel,
  });

  const decoded = verifyToken({
    token,
    secretKey:
      tokenType === tokenTypeEnum.Access
        ? signature.accessSignature
        : signature.refreshSignature,
  });

  const isRevoked = await get({
    key: revokeTokenKey({
      userId: decoded.id,
      jti: decoded.jti,
    }),
  });
  if (isRevoked) throw unauthorizedException("Token Is Revoked");

  const user = await findById({
    model: userModel,
    id: decoded.id,
  });
  if (!user) throw notFoundException("User not found");
  if (decoded.iat * 1000-user.changeCredentialsTime?.getTime() < 0 )
    throw unauthorizedException({ message: "Token is expired" });

  return { user, decoded };
};


export const authentication = ({ tokenType = tokenTypeEnum.Access }) => {
  return async (req, res, next) => {
    const { user, decoded } = await decodeToken({
      authorization: req.headers.authorization,
      tokenType,
    });
    req.user = user;
    req.decoded = decoded;
    return next();
  };
};

export const authorization = ({ accessRoles = [] }) => {
  return async (req, res, next) => {
    if (!accessRoles.includes(req.user.role))
      throw forbiddenException({
        message: "You are not authorized to access this resource",
      });
    return next();
  };
};
