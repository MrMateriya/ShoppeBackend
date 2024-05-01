import jwt from "jsonwebtoken";
import {RefreshTokenModel} from "../models/refreshToken.js";

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
  static async generateRefreshToken(payload) {
    try {
      return await jwt.sign(
        payload,
        process.env.TOKEN_REFRESH_SECRET,
        {
          expiresIn: process.env.TOKEN_REFRESH_EXPIRES_IN
        })
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
  static async removeRefreshToken(refreshToken) {
    const refreshTokenQuery = await RefreshTokenModel.deleteOne({refreshToken})
    return refreshTokenQuery
  }
  static async findRefreshToken(refreshToken) {
    const refreshTokenQuery = await RefreshTokenModel.findOne({refreshToken})
    return refreshTokenQuery
  }
}

export {TokenService}