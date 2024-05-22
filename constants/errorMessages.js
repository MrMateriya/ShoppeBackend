class ErrorMessage {
  static USER_NOT_FOUND = 'Пользователь не найден'
  static LOGIN_VALIDATION_FAILED = 'Неверный логин или пароль'
  static LOGIN_FAILED = 'Ошибка входа'
  static REGISTRATION_FAILED = 'Ошибка регистрации'
  static USER_ALREADY_EXIST = 'Такой пользователь уже зарегистрирован'
  static LOGOUT_FAILED = 'Ошибка выхода'
  static UNAUTHORIZED = 'Пользователь неаутентифицированный'
  static REFRESH_FAILED = 'Ошибка обновления refresh токена'
  static ACTIVATE_EMAIL_FAILED = 'Не удалость активировать почту'
  static ACTIVATE_EMAIL_LINK_NOT_FOUND = 'Отсутствует ссылка активации почты'
  static RESET_PASSWORD_LINK_NOT_FOUND = 'Отсутствует ссылка сброса пароля'
  static RESET_PASSWORD_TOKEN_NOT_FOUND = 'Отсутствует токен сброса пароля'
  static RESET_PASSWORD_TOKEN_SAVED_NOT_FOUND = 'Отсутствует токен сброса пароля в базе данных'
  static RESET_PASSWORD_IS_EQUAL = 'Пароль совпадает с предыдущим'
  static SEND_ACTIVATION_MAIL_FAILED = 'Произошла ошибка при отправке подтверждающего почту письма на почту'
  static SEND_RESET_PASSWORD_MAIL_FAILED = 'Произошла ошибка при отправке подтверждающего письма для сброса пароля на почту'
  static RESET_PASSWORD_ERROR = 'Произошла ошибка при изменении пароля на новый'
}


export {ErrorMessage}