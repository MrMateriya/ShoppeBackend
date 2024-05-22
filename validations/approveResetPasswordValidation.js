import {cookie, param} from "express-validator";
import {ErrorMessage} from "../constants/errorMessages.js";

const approveResetPasswordValidation = [
  param('link', ErrorMessage.RESET_PASSWORD_LINK_NOT_FOUND),
  cookie('resetPasswordToken', ErrorMessage.RESET_PASSWORD_TOKEN_NOT_FOUND)
]

export {approveResetPasswordValidation}