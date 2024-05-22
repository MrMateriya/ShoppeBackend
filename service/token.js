import jwt from "jsonwebtoken";
import {RefreshTokenModel} from "../models/refreshToken.js";
import {ResetPasswordTokenModel} from "../models/resetPasswordTokenModel.js";

class TokenService {
  static async generateAccessToken(payload) {
    try {
      return await jwt.sign(
        payload,
        process.env.TOKEN_ACCESS_SECRET,
        {
          expiresIn: process.env.TOKEN_ACCESS_EXPIRES_IN
        })
    } catch (e) {
      console.log(e)

      return null
    }
  }
  static async generateResetPasswordToken(payload) {
    try {
      return await jwt.sign(
        payload,
        process.env.TOKEN_RESET_PASSWORD_SECRET,
        {
          expiresIn: process.env.TOKEN_RESET_PASSWORD_EXPIRES_IN
        })
    } catch (e) {
      console.log(e)

      return null
    }
  }
  static async generateRefreshToken(payload, isRemember) {
    try {
      if (isRemember) {
        return (await jwt.sign(
            payload,
            process.env.TOKEN_REFRESH_SECRET,
            {
              expiresIn: process.env.TOKEN_REFRESH_EXPIRES_IN_REMEMBERED
            })
        );
      }
      return (await jwt.sign(
          payload,
          process.env.TOKEN_REFRESH_SECRET,
          {
            expiresIn: process.env.TOKEN_REFRESH_EXPIRES_IN
          })
      );
    } catch (e) {
      console.log(e)

      return null
    }
  }
  static async validateAccessBearerToken(token) {
    try {
      token = token.replace(/Bearer\s?/, '')
      const validatedToken = await jwt.verify(token, process.env.TOKEN_ACCESS_SECRET)
      return validatedToken
    } catch (e) {
      console.log(e)
    }
  }
  static async validateRefreshBearerToken(token) {
    try {
      token = token.replace(/Bearer\s?/, '')
      const validatedToken = await jwt.verify(token, process.env.TOKEN_REFRESH_SECRET)
      return validatedToken
    } catch (e) {
      console.log(e)
    }
  }
  static async validateResetPasswordToken(token) {
    try {
      token = token.replace(/Bearer\s?/, '')
      const validatedToken = await jwt.verify(token, process.env.TOKEN_RESET_PASSWORD_SECRET)
      return validatedToken
    } catch (e) {
      console.log(e)
    }
  }
  static async saveRefreshToken(userId, token) {
    try {
      const tokenModel = await RefreshTokenModel.findOne({userId})
      if (tokenModel) {
        tokenModel.refreshToken = token
        return await tokenModel.save()
      }

      const doc = new RefreshTokenModel({
        userId,
        refreshToken: token
      })

      const refreshToken = await doc.save()

      return refreshToken
    } catch (e) {
      console.log(e)

      return null
    }
  }
  static async saveResetPasswordToken(userId, token) {
    try {
      const tokenModel = await ResetPasswordTokenModel.findOne({userId})
      if (tokenModel) {
        tokenModel.resetPasswordToken = token
        return await tokenModel.save()
      }

      const doc = new ResetPasswordTokenModel({
        userId,
        resetPasswordToken: token
      })

      const resetPasswordToken = await doc.save()

      return resetPasswordToken
    } catch (e) {
      console.log(e)

      return null
    }
  }
  static async removeRefreshToken(refreshToken) {
    const refreshTokenQuery = await RefreshTokenModel.deleteOne({refreshToken})
    return refreshTokenQuery
  }
  static async findRefreshToken(refreshToken) {
    const refreshTokenQuery = await RefreshTokenModel.findOne({refreshToken})
    return refreshTokenQuery
  }
  static async findResetPasswordToken(resetPasswordToken) {
    const resetPasswordTokenQuery = await ResetPasswordTokenModel.findOne({resetPasswordToken})
    return resetPasswordTokenQuery
  }
  static async setResetPasswordTokenInCookies(res, resetPasswordToken) {
    res.cookie('resetPasswordToken', resetPasswordToken, {
      maxAge: process.env.TOKEN_RESET_PASSWORD_EXPIRES_IN_NUM,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
  }
  static async setTokensInCookies(res, accessToken, refreshToken) {
    const {isRemember} = await TokenService.validateRefreshBearerToken(refreshToken)

    res.cookie('refreshToken', refreshToken, {
      maxAge: isRemember? process.env.TOKEN_REFRESH_EXPIRES_IN_NUM_REMEMBERED : process.env.TOKEN_REFRESH_EXPIRES_IN_NUM,
      httpOnly: true,
      sameSite: 'strict'})
    res.cookie('accessToken', accessToken, {
      maxAge: process.env.TOKEN_ACCESS_EXPIRES_IN_NUM,
      httpOnly: true,
      sameSite: 'strict'})
  }
}

export {TokenService}