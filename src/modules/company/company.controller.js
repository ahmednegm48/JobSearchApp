import { Router } from "express";
import * as companyValidation from "./company.validation.js";
import * as companyService from "./company.service.js";
import { validation } from "../../common/middleware/validation.js";
import { authentication, authorization } from "../../common/middleware/authentication.js";
import { roleEnum, tokenTypeEnum } from "../../common/utils/enum/enum.js";
import { fileValidation, localFileUpload } from "../../common/utils/multer/local.multer.js";

const router = Router();

router.post(
  "/create",
  authentication({ tokenType: tokenTypeEnum.Access }),
  authorization({ accessRoles: [roleEnum.Admin,roleEnum.User] }),
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
  validation(companyValidation.softDeleteSchema),
  companyService.softDelete,
);

export default router;