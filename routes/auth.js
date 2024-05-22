import {Router} from "express";
import {UserController} from "../controllers/user.js";
import {registrationValidation} from "../validations/registration.js";
import {loginValidation} from "../validations/login.js";
import {checkAuth} from "../middlewares/checkAuth.js";
import {checkAuthorizationValidation} from "../validations/authorization.js";
import {handleValidationError} from "../middlewares/handleValidationError.js";
import {checkRefreshToken} from "../validations/refreshToken.js";
import {emailActivationValidation} from "../validations/emailActivation.js";
import {askResetPassword} from "../validations/askResetPassword.js";
import {approveResetPasswordValidation} from "../validations/approveResetPasswordValidation.js";
import {resetPassword} from "../validations/resetPassword.js";

const AuthRouter = new Router()

AuthRouter.post('/login', loginValidation, handleValidationError, UserController.loginUser)
AuthRouter.post('/registration', registrationValidation, handleValidationError, UserController.registerUser)
AuthRouter.post('/logout', checkRefreshToken, handleValidationError, UserController.logoutUser)

AuthRouter.get('/refresh', checkRefreshToken, handleValidationError, UserController.refreshUser)

AuthRouter.get('/activate/:link', emailActivationValidation, handleValidationError, UserController.activateEmailUser)

AuthRouter.post('/ask-reset-password', askResetPassword, handleValidationError, UserController.askResetPassword)
AuthRouter.get('/approve-reset-password/:link', approveResetPasswordValidation, handleValidationError, UserController.approveResetPassword)
AuthRouter.post('/reset-password', resetPassword, handleValidationError, UserController.resetPassword)

AuthRouter.get('/me', checkAuthorizationValidation, handleValidationError, checkAuth, UserController.getUser)
AuthRouter.get('/users', checkAuthorizationValidation, handleValidationError, checkAuth, UserController.getUsers)

export {AuthRouter}