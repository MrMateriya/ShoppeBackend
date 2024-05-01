import {cookie} from "express-validator";
import {ErrorMessage} from "../constants/errorMessages.js";

const checkRefreshToken = [
  cookie('refreshToken', ErrorMessage.UNAUTHORIZED)
]

export {checkRefreshToken}