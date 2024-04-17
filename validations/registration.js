import {body} from "express-validator";

const registrationValidation = [
  body('login', 'Логин должен содержать минимум 3 символа').isLength({min: 3}),
  body('email', 'Некорректный формат почты').isEmail(),
  body('password', 'Пароль должен содержать минимум 5 символов').isLength({min: 5}),
  body('avatarUrl', 'Неферный формат url').optional().isURL()
]

export {registrationValidation}