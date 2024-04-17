import express from 'express'
import {UserController} from "../controllers/user.controller.js";

const UserRouter = new express()

UserRouter.get('/users', UserController.getAllUsers)
UserRouter.get('/users/:id', UserController.getUser)
UserRouter.post('/users', UserController.addUser)

export {UserRouter}