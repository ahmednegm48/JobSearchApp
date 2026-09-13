import { Router } from "express";
import * as jobValidation from "./job.validation.js";
import * as jobService from "./job.service.js";
import { validation } from "../../common/middleware/validation.js";
import {
  authentication,
  authorization,
} from "../../common/middleware/authentication.js";
import { tokenTypeEnum } from "../../common/utils/enum/enum.js";

const router = Router();

router.post(
  "/:companyId",
  authentication({ tokenType: tokenTypeEnum.Access }),
  validation(jobValidation.addJobSchema),
  jobService.addJob,
);

router.patch(
  "/:jobId",
  authentication({ tokenType: tokenTypeEnum.Access }),
  validation(jobValidation.updateJobSchema),
  jobService.updateJob,
);

router.delete(
  "/:jobId",
  authentication({ tokenType: tokenTypeEnum.Access }),
  jobService.deleteJob,
);

router.get("/", jobService.filteredJobs);
router.get(
  "/:jobId/application",
  authentication({ tokenType: tokenTypeEnum.Access }),
  jobService.getApplication,
);

export default router;
