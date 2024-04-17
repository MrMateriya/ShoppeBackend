import jwt from 'jsonwebtoken'
import {validationResult} from "express-validator";
import {UserSchemaModel} from "../models/user.js";
import bcrypt from 'bcrypt'
import {SECRET_SALT} from "../testEnvConsts/likeEnv.js";
class UserController {
  static async authorizeUser(req, res) {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        return res.status(406).json(errors)
      }
      const {email, password} = req.body

      const user = await UserSchemaModel.findOne({
        email
      })
      if (!user) {
        return res.status(406).json({
          message: 'Пользователь не найден'
        })
      }
      const isValidPassword = await bcrypt.compare(password, user._doc.passwordHash)
      if (!isValidPassword) {
        return res.status(406).json({
          message: 'Неверный логин или пароль'
        })
      }

      const token = jwt.sign({
          id: user._id
        }, SECRET_SALT,
        {
          expiresIn: '1d'
        })

      delete user._doc.passwordHash
      res.json({...user._doc, token})
    }
    catch (e) {
      console.log(e)
      res.status(400).json({
        message: 'Ошибка авторизации'
      })
    }
  }
  static async registerUser(req, res) {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        return res.status(406).json(errors)
      }
      const {login, password, email} = req.body

      const salt = await bcrypt.genSalt()
      const passwordHash = await bcrypt.hash(password, salt)

      const doc = new UserSchemaModel({
        login,
        passwordHash,
        email
      })
      const user = await doc.save()

      const token = jwt.sign({
        id: user._id
      }, SECRET_SALT,
      {
        expiresIn: '1d'
      })

      delete user._doc.passwordHash
      res.json({...user._doc, token})
    }
    catch (e) {
      console.log(e)
      res.status(500).json({
        message: 'Ошибка регистрации'
      })
    }
  }
  static async getUser(req, res) {
    try {
      const {userId} = req.body
      const user = await UserSchemaModel.findById(userId)
      if (!user) {
        return res.status(406).json({
          message: 'Пользователь не найден'
        })
      }

      delete user._doc.passwordHash
      res.json(user._doc)
    }
    catch (e) {
      console.log(e)
      res.status(406).json({
        message: 'Ошибка при получении пользователя'
      })
    }
  }
}
export {UserController}