import nodeMailer from 'nodemailer'
import {ErrorMessage} from "../constants/errorMessages.js";
class MailService {
  constructor() {
    this.transport = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_SHOPPE_USER,
        pass: process.env.EMAIL_SHOPPE_PASSWORD,
      },
    });
  }
  async sendActivationMail(to, link) {
    try {
      await this.transport.sendMail({
        from: {
          name: 'Shoppe',
          address: process.env.EMAIL_SHOPPE_USER
        },
        to: to,
        subject: "Email confirmation",
        text: "Shoppe confirmation by gmail",
        html: `
              <div>
                <h1 style="color: #000000; margin: 20px 0;">Please confirm your email using the link below</h1>
                <div style="height: 1px; width: 100%; background-color: #A18A68; margin-bottom: 15px"></div>
                <a style="color: #A18A68; text-decoration: none; font-size: 20px" href="${link}">${link}</a>
              </div>
            `
      })
    } catch (e) {
      console.log(ErrorMessage.SEND_ACTIVATION_MAIL_FAILED)
      console.log(e)
    }
  }
  async sendResetPasswordMail(to, link) {
    try {
      await this.transport.sendMail({
        from: {
          name: 'Shoppe',
          address: process.env.EMAIL_SHOPPE_USER
        },
        to: to,
        subject: "Password reset confirmation",
        text: "Shoppe confirmation reset password by gmail",
        html: `
              <div>
                <h1 style="color: #000000; margin: 20px 0;">Please confirm the password reset by clicking on the link below</h1>
                <div style="height: 1px; width: 100%; background-color: #A18A68; margin-bottom: 15px"></div>
                <a style="color: #A18A68; text-decoration: none; font-size: 20px" href="${link}">${link}</a>
              </div>
            `
      })
    } catch (e) {
      console.log(ErrorMessage.SEND_RESET_PASSWORD_MAIL_FAILED)
      console.log(e)
    }
  }
}
const mailService = new MailService()
export {mailService as MailService}