import jwt from "jsonwebtoken";
import {validationResult} from "express-validator";
import {SECRET_SALT} from "../testEnvConsts/likeEnv.js";

const checkAuth = (req, res, next) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(406).json(errors)
    }
    let token = req.headers.authorization
    if (!token) {
      res.status(406).json({
        message: 'Ошибка авторизации, отсутствует токен'
      })
    }
    token = token.replace(/Bearer\s?/, '')
    req.body.userId = jwt.verify(token, SECRET_SALT).id
    next()
  }
  catch (e) {
    console.log(e)
    res.status(406).json({
      message: 'Ошибка авторизации (middleware)'
    })
  }
}

export {checkAuth}