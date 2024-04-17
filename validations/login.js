import {body} from "express-validator";

const loginValidation = [
  body('email', 'Некорректный формат почты').isEmail(),
  body('password', 'Пароль должен содержать минимум 5 символов').isLength({min: 5}),
]

export {loginValidation}