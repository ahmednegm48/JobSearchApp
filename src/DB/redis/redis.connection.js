import { createClient } from "redis";
import { REDIS_URL } from "../../config/config.service.js";

export const redisClient = createClient({
  url: REDIS_URL,
  RESP: 2,
});
export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("redis connected");
  } catch (error) {
    console.log("redis failed to connect", error);
  }
};
redisClient.on("error", function (err) {
  console.error("Redis client error:", err);
});