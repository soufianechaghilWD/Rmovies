const express = require('express')
const { Register } = require('./userController/register')
const { Login } = require('./userController/login')
const userRouter = express.Router()
const { returnError } = require('./errorHandling')

userRouter.post('/register', async (req, res, next) => {
    try{
        const {email, username, password} = req.body
        const id = await Register(email, username, password)
        res.status(200).json(id)
    }
    catch(err) {
        returnError(err, res)
    }
})

userRouter.post('/login', async(req, res, next) => {
    try{
        const {username, password} = req.body
        const token = await Login(username, password)
        res.status(200).json(token)
    }
    catch(err){
        returnError(err, res)
    }
})

module.exports = userRouter