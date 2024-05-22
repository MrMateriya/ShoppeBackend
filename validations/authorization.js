import {cookie} from "express-validator";

const checkAuthorizationValidation = [
  cookie('accessToken', 'AccessToken не найден'),
]

export {checkAuthorizationValidation}