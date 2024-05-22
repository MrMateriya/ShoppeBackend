import {body} from "express-validator";

const askResetPassword = [
  body('email', 'Некорректный формат почты').isEmail(),
]

export {askResetPassword}
