import express from 'express'
import {UserRouter} from "./express/user.routes.js";
import {AuthRouter} from "./routes/auth.routes.js";

const server = express()
const serverPort = 5000;

server.use(express.json())
server.use('/api', UserRouter)
server.use('/api', AuthRouter)

server.listen(serverPort, (err) => {
  if (err) {
    throw new Error(err)
  }
  console.log(`Host server, port: ${serverPort}`)
})