import { corsOptions } from "./common/utils/cors/cors.utils.js";
import cors from "cors";
import helmet from "helmet";
import {
  globalErrorHandler,
  notFoundException,
} from "./common/utils/response/error.response.js";
import connectDB from "./DB/mongo/mongo.connection.js";
import { connectRedis } from "./DB/redis/redis.connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import companyRouter from "./modules/company/company.controller.js";
import jobRouter from "./modules/job/job.controller.js";
import applicationRouter from "./modules/application/application.controller.js";
import { customRateLimit } from "./common/middleware/rete-limit.middleware.js";
import { intializeSocket } from "./common/utils/socket/socket.service.js";
import { PORT } from "./config/config.service.js";

const bootstrap = async (app, express) => {
  app.use(express.json(), cors(corsOptions()), helmet(), customRateLimit());
  await connectRedis(); //running redis connection locally on redis://localhost:6379
  await connectDB();

  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/company", companyRouter);
  app.use("/job", jobRouter);
  app.use("/application", applicationRouter);

  app.get("/", (req, res) => res.send("welcome :)"));

  app.all("/*dummy", (req, res) => {
    throw notFoundException("Not Found!!!!");
  });

  app.use(globalErrorHandler);

  const httpServer = app.listen(PORT, () =>
    console.log(`app listening on port ${PORT}!`),
  );
  intializeSocket(httpServer);
};

export default bootstrap;
