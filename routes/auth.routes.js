import express from "express";
import {UserController} from "../controllers/userController.js";
import {registrationValidation} from "../validations/registration.js";
import {loginValidation} from "../validations/login.js";
import {checkAuth} from "../utils/checkAuth.js";
import {checkAuthorizationValidation} from "../validations/checkAuthorization.js";

const AuthRouter = new express()

AuthRouter.post('/login', loginValidation, UserController.authorizeUser)
AuthRouter.post('/registration', registrationValidation, UserController.registerUser)
AuthRouter.get('/me', checkAuthorizationValidation, checkAuth, UserController.getUser)

export {AuthRouter}