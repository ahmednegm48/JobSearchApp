import { SALT_ROUNDS } from "../../../config/config.service.js";
import { compare, hash } from "bcrypt";

export const generateHash = async ({
  plaintext,
  SaltRounds = Number(SALT_ROUNDS),
}) => {
  let hashResult = await hash(plaintext, SaltRounds);
  return hashResult;
};

export const compareHash = async ({
  plaintext,
  ciphertext,
}) => {
  let match = await compare(plaintext, ciphertext);
  return match;
};
