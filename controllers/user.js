import {UserModel} from "../models/user.js";
import bcrypt from 'bcrypt'
import {ErrorMessage} from "../constants/errorMessages.js";
import {TokenService} from "../service/token.js";
import { v4 as uuidv4 } from 'uuid';
import {MailService} from "../service/mail.js";
import {ResetPasswordTokenModel} from "../models/resetPasswordTokenModel.js";
class UserController {
  static async loginUser(req, res) {
    try {
      const {email, password, isRemember} = req.body

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
        id: user._id,
        isRemember,
      }, isRemember)
      const savedRefreshToken = await TokenService.saveRefreshToken(user._id, refreshToken)

      await TokenService.setTokensInCookies(res, accessToken, refreshToken)

      delete user._doc.passwordHash
      res.json({...user._doc, accessToken, refreshToken, isRemember})
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
      const {login, password, email, isRemember} = req.body

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

      await MailService.sendActivationMail(email, `${process.env.URL_BACKEND}/activate/${emailActivationLink}`)

      const accessToken = await TokenService.generateAccessToken({
        id: user._id
      })
      const refreshToken = await TokenService.generateRefreshToken({
        id: user._id,
        isRemember,
      }, isRemember)

      const savedRefreshToken = await TokenService.saveRefreshToken(user._id, refreshToken)

      await TokenService.setTokensInCookies(res, accessToken, refreshToken)

      delete user._doc.passwordHash
      res.json({...user._doc, accessToken, refreshToken, isRemember})
    }
    catch (e) {
      console.log(e)

      return res.status(500).json({
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
      res.clearCookie('accessToken')

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
        id: user._id,
        isRemember: validatedToken.isRemember,
      }, validatedToken.isRemember)
      const savedRefreshToken = await TokenService.saveRefreshToken(user._id, newRefreshToken)

      await TokenService.setTokensInCookies(res, newAccessToken, newRefreshToken)

      delete user._doc.passwordHash
      res.json({...user._doc, accessToken: newAccessToken, refreshToken: newRefreshToken})
    } catch (e) {
      console.log(e)

      return res.status(500).json({
        message: ErrorMessage.REFRESH_FAILED
      })
    }
  }
  static async activateEmailUser(req, res) {
    try {
      const emailActivationLink = req.params.link
      if (!emailActivationLink) {
        return res.status(400).json({
          message: ErrorMessage.ACTIVATE_EMAIL_LINK_NOT_FOUND
        })
      }

      const user = await UserModel.findOne({emailActivationLink})
      if (!user) {
        return res.status(400).json({
          message: ErrorMessage.USER_NOT_FOUND
        })
      }

      if (user.isEmailConfirmed === true) {
        return res.redirect(process.env.URL_FRONTEND)
      }

      user.isEmailConfirmed = true
      await user.save()
      return res.redirect(process.env.URL_FRONTEND)
    } catch (e) {
      console.log(e)

      return res.status(500).json({
        message: ErrorMessage.ACTIVATE_EMAIL_FAILED
      })
    }
  }
  static async askResetPassword(req, res) {
    try {
      const {email} = req.body

      const user = await UserModel.findOne({
        email
      })
      if (!user) {
        return res.status(406).json({
          message: ErrorMessage.USER_NOT_FOUND
        })
      }

      const passwordResetLink = uuidv4()
      const resetPasswordToken = await TokenService.generateResetPasswordToken({
        id: user._id
      })

      await TokenService.saveResetPasswordToken(user.id, resetPasswordToken)

      await TokenService.setResetPasswordTokenInCookies(res, resetPasswordToken)

      await MailService.sendResetPasswordMail(email, `${process.env.URL_BACKEND}/approve-reset-password/${passwordResetLink}`)

      delete user._doc.passwordHash
      res.json({resetPasswordToken})
    } catch (e) {
      console.log(e)

      return res.status(500).json({
        message: ErrorMessage.RESET_PASSWORD_ERROR
      })
    }
  }
  static async approveResetPassword(req, res) {
    try {
      const resetPasswordLink = req.params.link
      const {resetPasswordToken} = req.cookies
      if (!resetPasswordLink) {
        return res.status(400).json({
          message: ErrorMessage.RESET_PASSWORD_LINK_NOT_FOUND
        })
      }
      if (!resetPasswordToken) {
        return res.status(400).json({
          message: ErrorMessage.RESET_PASSWORD_TOKEN_NOT_FOUND
        })
      }

      const savedResetPasswordToken =  await TokenService.findResetPasswordToken(resetPasswordToken)

      if (!savedResetPasswordToken) {
        return res.status(400).json({
          message: ErrorMessage.RESET_PASSWORD_TOKEN_SAVED_NOT_FOUND
        })
      }

      return res.redirect(`${process.env.URL_FRONTEND}/reset-password`)
    } catch (e) {
      console.log(e)

      return res.status(500).json({
        message: ErrorMessage.RESET_PASSWORD_ERROR
      })
    }
  }
  static async resetPassword(req, res) {
    const {password} = req.body
    const {resetPasswordToken} = req.cookies

    if (!resetPasswordToken) {
      return res.status(400).json({
        message: ErrorMessage.RESET_PASSWORD_TOKEN_NOT_FOUND
      })
    }

    const validatedToken = await TokenService.validateResetPasswordToken(resetPasswordToken)
    const savedToken = await TokenService.findResetPasswordToken(resetPasswordToken)
    if (!validatedToken || !savedToken) {
      return res.status(401).json({
        message: ErrorMessage.UNAUTHORIZED
      })
    }

    const user = await UserModel.findOne({
      _id: validatedToken.id
    })

    if (!user) {
      return res.status(406).json({
        message: ErrorMessage.USER_NOT_FOUND
      })
    }

    console.log(password)
    console.log(user.passwordHash)
    const isEqual = await bcrypt.compare(password, user.passwordHash)
    if (isEqual) {
      return res.status(406).json({
        message: ErrorMessage.RESET_PASSWORD_IS_EQUAL
      })
    }

    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    user.passwordHash = passwordHash

    await user.save()

    res.clearCookie('resetPasswordToken')

    console.log({...user._doc})

    delete user._doc.passwordHash
    return res.json({...user._doc})
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
      return res.json(user._doc)
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