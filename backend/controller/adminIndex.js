const express = require('express')
const { Login } = require('./adminController/login')
const { returnError } = require('./errorHandling')

const adminRouter = express.Router()

adminRouter.post('/loginAdmin', async (req, res, next) => {
    try{
        const {ident, pass} = req.body
        const token = await Login(ident, pass)
        res.status(200).json(token)
    }
    catch(err){
        returnError(err, res)
    }
})

module.exports = adminRouter;