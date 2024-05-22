import {body} from "express-validator";

const registrationValidation = [
  body('login', 'Логин некорректно введён').matches(new RegExp(process.env.VALIDATION_LOGIN_PATTERN)),
  body('email', 'Некорректный формат почты').isEmail().toLowerCase(),
  body('password', 'Пароль некорректно введён').matches(new RegExp(process.env.VALIDATION_PASSWORD_PATTERN)),
  body('avatarUrl', 'Неферный формат url').optional().isURL()
]

export {registrationValidation}