import { tooManyRequestsException } from "../utils/response/error.response.js";

const ipRequest = {};

const blockedIps = new Set();

const unblockersTimers = new Map();

const RATE_LIMIT = 30;  //30 for testing only
const WINDOW_MS = 60 * 1000;

export const customRateLimit = () => {
  return (req, res, next) => {
    const ip = req.ip;

    const curruntTime = Date.now();

    if (blockedIps.has(ip)) throw tooManyRequestsException();
    if (!ipRequest[ip]) {
      ipRequest[ip] = {
        count: 1,
        startTime: curruntTime,
      };
      return next();
    }

    const diff = curruntTime - ipRequest[ip].startTime;

    if (diff < WINDOW_MS) {
      ipRequest[ip].count++;
      if (ipRequest[ip].count > RATE_LIMIT) {
        blockedIps.add(ip);

        if (!unblockersTimers.has(ip)) {
          const timer = setTimeout(() => {
            blockedIps.delete(ip);
            unblockersTimers.delete(ip);
          }, WINDOW_MS);
          unblockersTimers.set(ip, timer);
        }
        throw tooManyRequestsException();
      }
    } else {
      ipRequest[ip] = {
        count: 1,
        startTime: curruntTime,
      };
    }

    return next();
  };
};