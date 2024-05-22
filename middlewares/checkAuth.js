import {TokenService} from "../service/token.js";

const checkAuth = async (req, res, next) => {
  try {
    let token = req.cookies.accessToken
    if (!token) {
      return res.status(401).json({
        message: 'Ошибка авторизации, отсутствует токен'
      })
    }
    const {id} = await TokenService.validateAccessBearerToken(token)
    req.body.userId = id
    next()
  }
  catch (e) {
    console.log(e)
    res.status(401).json({
      message: 'Ошибка авторизации (middleware)'
    })
  }
}

export {checkAuth}