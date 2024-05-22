import {body, cookie} from "express-validator";
import {ErrorMessage} from "../constants/errorMessages.js";
const resetPassword = [
  body('password', 'Пароль некорректно введён').matches(new RegExp(process.env.VALIDATION_PASSWORD_PATTERN)),
  cookie('resetPasswordToken', ErrorMessage.RESET_PASSWORD_TOKEN_NOT_FOUND),
]

export {resetPassword}
