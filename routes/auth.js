import {Router} from "express";
import {UserController} from "../controllers/user.js";
import {registrationValidation} from "../validations/registration.js";
import {loginValidation} from "../validations/login.js";
import {checkAuth} from "../middlewares/checkAuth.js";
import {checkAuthorizationValidation} from "../validations/authorization.js";
import {handleValidationError} from "../middlewares/handleValidationError.js";
import {checkRefreshToken} from "../validations/refreshToken.js";

const AuthRouter = new Router()

AuthRouter.post('/login', loginValidation, handleValidationError, UserController.loginUser)
AuthRouter.post('/registration', registrationValidation, handleValidationError, UserController.registerUser)
AuthRouter.post('/logout', checkRefreshToken, handleValidationError, UserController.logoutUser)
AuthRouter.post('/refresh', checkRefreshToken, handleValidationError, UserController.refreshUser)


AuthRouter.get('/me', checkAuthorizationValidation, handleValidationError, checkAuth, UserController.getUser)
AuthRouter.get('/users', checkAuthorizationValidation, handleValidationError, checkAuth, UserController.getUsers)

export {AuthRouter}