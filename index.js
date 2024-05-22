import 'dotenv/config'

import express from 'express'
import {AuthRouter} from "./routes/auth.js";
import {mongoDBConnect} from "./database.js";
import cors from 'cors'
import cookieParser from 'cookie-parser'

const server = express()
const serverPort = process.env.SERVER_PORT || 3000;

mongoDBConnect()

server.use(express.json())
server.use(cors({
  origin: process.env.URL_FRONTEND,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true
}))
server.use(cookieParser())

server.use('/api', AuthRouter)

server.listen(serverPort, (err) => {
  if (err) {
    throw new Error(err)
  }
  console.log(`Host server, port: ${serverPort}`)
})