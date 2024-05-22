import {param} from "express-validator";
import {ErrorMessage} from "../constants/errorMessages.js";

const emailActivationValidation = [
  param('link', ErrorMessage.ACTIVATE_EMAIL_LINK_NOT_FOUND)
]

export {emailActivationValidation}