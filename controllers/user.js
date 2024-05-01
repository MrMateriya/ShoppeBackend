import {UserModel} from "../models/user.js";
import bcrypt from 'bcrypt'
import {ErrorMessage} from "../constants/errorMessages.js";
import {TokenService} from "../service/token.js";
import { v4 as uuidv4 } from 'uuid';
import {MailService} from "../service/mail.js";
class UserController {
  static async loginUser(req, res) {
    try {
      const {email, password} = req.body

      const user = await UserModel.findOne({
        email
      })
      if (!user) {
        return res.status(406).json({
          message: ErrorMessage.USER_NOT_FOUND
        })
      }

      const isValidPassword = await bcrypt.compare(password, user._doc.passwordHash)
      if (!isValidPassword) {
        return res.status(406).json({
          message: ErrorMessage.LOGIN_VALIDATION_FAILED
        })
      }

      const accessToken = await TokenService.generateAccessToken({
        id: user._id
      })
      const refreshToken = await TokenService.generateRefreshToken({
        id: user._id
      })
      const savedRefreshToken = await TokenService.saveRefreshToken(user._id, refreshToken)

      //вытащить дни из .env
      res.cookie('refreshToken', refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

      delete user._doc.passwordHash
      res.json({...user._doc, accessToken, refreshToken})
    }
    catch (e) {
      console.log(e)

      return res.status(500).json({
        message: ErrorMessage.LOGIN_FAILED
      })
    }
  }
  static async registerUser(req, res) {
    try {
      const {login, password, email} = req.body

      const isExists = await UserModel.findOne({email})
      if (isExists) {
        return res.status(400).json({
          message: ErrorMessage.USER_ALREADY_EXIST
        })
      }

      const salt = await bcrypt.genSalt()
      const passwordHash = await bcrypt.hash(password, salt)
      const emailActivationLink = uuidv4()

      const doc = new UserModel({
        login,
        passwordHash,
        email,
        emailActivationLink
      })
      const user = await doc.save()

      await MailService.sendActivationMail(email, emailActivationLink)

      const accessToken = await TokenService.generateAccessToken({
        id: user._id
      })
      const refreshToken = await TokenService.generateRefreshToken({
        id: user._id
      })
      const savedRefreshToken = await TokenService.saveRefreshToken(user._id, refreshToken)

      //вытащить дни из .env
      res.cookie('refreshToken', refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

      delete user._doc.passwordHash
      res.json({...user._doc, accessToken, refreshToken})
    }
    catch (e) {
      console.log(e)

      return  res.status(500).json({
        message: ErrorMessage.REGISTRATION_FAILED
      })
    }
  }
  static async logoutUser(req, res) {
    try {
      const {refreshToken} = req.cookies
      if (!refreshToken) {
        return res.status(401).json({
          message: ErrorMessage.UNAUTHORIZED
        })
      }

      res.clearCookie('refreshToken')
      const refreshTokenQuery =  await TokenService.removeRefreshToken(refreshToken)

      return res.status(200).json({
        refreshTokenQuery
      })
    } catch (e) {
      console.log(e)

      return  res.status(500).json({
        message: ErrorMessage.LOGOUT_FAILED
      })
    }
  }
  static async refreshUser(req, res) {
    try {
      const {refreshToken} = req.cookies
      if (!refreshToken) {
        return res.status(401).json({
          message: ErrorMessage.UNAUTHORIZED
        })
      }
      const validatedToken = await TokenService.validateRefreshBearerToken(refreshToken)
      const savedToken = await TokenService.findRefreshToken(refreshToken)
      if (!validatedToken || !savedToken) {
        return res.status(401).json({
          message: ErrorMessage.UNAUTHORIZED
        })
      }

      const user = await UserModel.findById(validatedToken.id)
      const newAccessToken = await TokenService.generateAccessToken({
        id: user._id
      })
      const newRefreshToken = await TokenService.generateRefreshToken({
        id: user._id
      })
      const savedRefreshToken = await TokenService.saveRefreshToken(user._id, newRefreshToken)

      //вытащить дни из .env
      res.cookie('refreshToken', newRefreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

      delete user._doc.passwordHash
      res.json({...user._doc, accessToken: newAccessToken, refreshToken: newRefreshToken})
    } catch (e) {
      console.log(e)

      return res.status(500).json({
        message: ErrorMessage.REFRESH_FAILED
      })
    }
  }
  static async getUser(req, res) {
    try {
      const {userId} = req.body
      const user = await UserModel.findById(userId)
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
  static async getUsers(req, res) {
    try {
      const users = await UserModel.find()
      console.log(users)
      return res.json({
        users
      })
    } catch (e) {
      console.log(e)

      return res.status(500).json({
        message: 'failed get users'
      })
    }

  }
}
export {UserController}