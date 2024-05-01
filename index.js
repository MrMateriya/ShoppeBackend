import express from 'express'
import {AuthRouter} from "./routes/auth.js";
import {mongoDBConnect} from "./database.js";
import cors from 'cors'
import dotenv from "dotenv";
import cookieParser from 'cookie-parser'

dotenv.config()

const server = express()
const serverPort = process.env.SERVER_PORT || 3000;

mongoDBConnect()

server.use(express.json())
server.use(cors())
server.use(cookieParser())

server.use('/api', AuthRouter)

server.listen(serverPort, (err) => {
  if (err) {
    throw new Error(err)
  }
  console.log(`Host server, port: ${serverPort}`)
})