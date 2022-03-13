const express = require('express')
const { Register } = require('./userController/register')
const userRouter = express.Router()


userRouter.post('/register', async (req, res, next) => {
    try{
        const {email, username, password} = req.body
        const user = await Register(email, username, password)
        res.json(user)
    }
    catch(err) {
        var status;
        if(err.status) status = err.status
        else status = 400


        res.status(status).json({
            message: err.message
        })
    }
})

module.exports = userRouter