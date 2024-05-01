import {header} from "express-validator";

const checkAuthorizationValidation = [
  header('authorization', 'Authorization header не найден'),
]

export {checkAuthorizationValidation}