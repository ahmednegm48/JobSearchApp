import dotenv from "dotenv";
import {resolve} from "node:path";

dotenv.config({path:resolve(`./src/config/.env`)})

export const PORT = process.env.PORT;
export const DB_URI = process.env.DB_URI;
export const SALT_ROUNDS = process.env.SALT_ROUNDS;
export const ENC_KEY = process.env.ENC_KEY;
export const ACCESS_TOKEN_USER_SECRET = process.env.ACCESS_TOKEN_USER_SECRET;
export const ACCESS_TOKEN_ADMIN_SECRET = process.env.ACCESS_TOKEN_ADMIN_SECRET;
export const ACCESS_TOKEN_USER_EXPIRATION = process.env.ACCESS_TOKEN_USER_EXPIRATION;
export const ACCESS_TOKEN_ADMIN_EXPIRATION = process.env.ACCESS_TOKEN_ADMIN_EXPIRATION;
export const REFRESH_TOKEN_USER_SECRET = process.env.REFRESH_TOKEN_USER_SECRET;
export const REFRESH_TOKEN_ADMIN_SECRET = process.env.REFRESH_TOKEN_ADMIN_SECRET;
export const REFRESH_TOKEN_USER_EXPIRATION = process.env.REFRESH_TOKEN_USER_EXPIRATION;
export const REFRESH_TOKEN_ADMIN_EXPIRATION = process.env.REFRESH_TOKEN_ADMIN_EXPIRATION;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const EMAIL = process.env.EMAIL;
export const PASSWORD = process.env.PASSWORD;
export const WHITE_LIST = process.env.WHITE_LIST;
export const REDIS_URL = process.env.REDIS_URL;