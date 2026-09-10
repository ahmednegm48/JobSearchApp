import { Router } from "express";
import * as userValidation from "./user.validation.js";
import * as userService from "./user.service.js";
import { validation } from "../../common/middleware/validation.js";
import { authentication, authorization } from "../../common/middleware/authentication.js";
import { roleEnum, tokenTypeEnum } from "../../common/utils/enum/enum.js";
import { fileValidation, localFileUpload } from "../../common/utils/multer/local.multer.js";

const router = Router();

router.patch(
  "/update-account",
  authentication({ tokenType: tokenTypeEnum.Access }),
  validation(userValidation.updateAccountSchema),
  userService.updateAccount,
);

router.get(
  "/profile",
  authentication({ tokenType: tokenTypeEnum.Access }),
  authorization({ accessRoles: [roleEnum.User, roleEnum.Admin] }),
  userService.getProfile,
);

router.get(
  "/:userId",
  validation(userValidation.getpublicProfileSchema),
  userService.getpublicProfile,
);

router.patch(
  "/update-password",
  authentication({ tokenType: tokenTypeEnum.Access }),
  authorization({ accessRoles: [roleEnum.Admin, roleEnum.User] }),
  validation(userValidation.updatePasswordSchema),
  userService.updatePassword,
);

router.patch(
  "/update-profile",
  authentication({ tokenType: tokenTypeEnum.Access }),
  authorization({ accessRoles: [roleEnum.User, roleEnum.Admin] }),
  localFileUpload({
    customPath: "users",
    validation: [...fileValidation.images],
  }).single("attachments"),
  userService.updateProfilePic,
);

router.patch(
  "/update-cover",
  authentication({ tokenType: tokenTypeEnum.Access }),
  authorization({ accessRoles: [roleEnum.User, roleEnum.Admin] }),
  localFileUpload({
    customPath: "users",
    validation: [...fileValidation.images],
  }).single("attachments"),
  userService.uploadCoverPic,
);

router.delete(
  "/profile-delete",
  authentication({ tokenType: tokenTypeEnum.Access }),
  userService.deleteProfilePic,
);

router.delete(
  "/cover-delete",
  authentication({ tokenType: tokenTypeEnum.Access }),
  userService.deleteCoverPic,
);

router.delete(
  "/:userId/soft-delete",
  authentication({ tokenType: tokenTypeEnum.Access }),
  validation(userValidation.softDeleteSchema),
  userService.softDelete,
);

export default router;