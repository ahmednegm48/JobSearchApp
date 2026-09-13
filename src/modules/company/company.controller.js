import { Router } from "express";
import * as companyValidation from "./company.validation.js";
import * as companyService from "./company.service.js";
import { validation } from "../../common/middleware/validation.js";
import {
  authentication,
  authorization,
} from "../../common/middleware/authentication.js";
import { roleEnum, tokenTypeEnum } from "../../common/utils/enum/enum.js";
import {
  fileValidation,
  localFileUpload,
} from "../../common/utils/multer/local.multer.js";

const router = Router();

router.post(
  "/create",
  authentication({ tokenType: tokenTypeEnum.Access }),
  authorization({ accessRoles: [roleEnum.Admin, roleEnum.User] }),
  validation(companyValidation.createCompanySchema),
  companyService.createCompany,
);

router.patch(
  "/:companyId/update",
  authentication({ tokenType: tokenTypeEnum.Access }),
  validation(companyValidation.updateCompanySchema),
  companyService.updateCompany,
);

router.delete(
  "/:companyId/delete",
  authentication({ tokenType: tokenTypeEnum.Access }),
  authorization({ accessRoles: [roleEnum.User, roleEnum.Admin] }),
  validation(companyValidation.softDeleteSchema),
  companyService.softDelete,
);

router.get("/:companyId/all-jobs", companyService.getCompanyWithJobs);

router.get("/search", companyService.searchCompany);

router.patch(
  "/:companyId/update-logo",
  authentication({ tokenType: tokenTypeEnum.Access }),
  authorization({ accessRoles: [roleEnum.User, roleEnum.Admin] }),
  localFileUpload({
    customPath: "users",
    validation: [...fileValidation.images],
  }).single("attachments"),
  companyService.updateLogo,
);

router.patch(
  "/:companyId/update-cover",
  authentication({ tokenType: tokenTypeEnum.Access }),
  authorization({ accessRoles: [roleEnum.User, roleEnum.Admin] }),
  localFileUpload({
    customPath: "users",
    validation: [...fileValidation.images],
  }).single("attachments"),
  companyService.uploadCoverPic,
);

router.delete(
  "/:companyId/logo-delete",
  authentication({ tokenType: tokenTypeEnum.Access }),
  companyService.deleteLogo,
);

router.delete(
  "/:companyId/cover-delete",
  authentication({ tokenType: tokenTypeEnum.Access }),
  companyService.deleteCoverPic,
);

router.get("/:companyId/jobs{/:jobId}",companyService.getJobs)
router.get("/",companyService.getJobs)

export default router;
