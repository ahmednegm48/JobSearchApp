import { Router } from "express";
import * as authRouter from "./auth.service.js";
import * as authValidation from "./auth.validation.js";
import { validation } from "../../common/middleware/validation.js";
import { authentication } from "../../common/middleware/authentication.js";
import { tokenTypeEnum } from "../../common/utils/enum/enum.js";

const router = Router();

router.post(
  "/signup",
  validation(authValidation.signupSchema),
  authRouter.signup,
);

router.patch(
  "/confirm-email",
  validation(authValidation.confirmEmailSchema),
  authRouter.confirmEmail,
);

router.post("/login", validation(authValidation.loginSchema), authRouter.login);

router.post("/google-login", authRouter.loginWithGoogle);

router.patch(
  "/forget-password",
  validation(authValidation.forgetPasswordSchema),
  authRouter.forgetPassword,
);

router.patch(
  "/reset-password",
  validation(authValidation.resetPasswordSchema),
  authRouter.resetPassword,
);

router.post(
  "/refresh",
  authentication({ tokenType: tokenTypeEnum.Refresh }),
  authRouter.refreshToken,
);

export default router;
