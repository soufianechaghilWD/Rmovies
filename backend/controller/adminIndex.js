const express = require('express')
const { Login } = require('./adminController/login')
const { returnError } = require('./errorHandling')
const { AddMtv } = require('./adminController/addMtv')
const { VerifyAdmin } = require('./adminController/verifyAdmin')
const { EditMtv } =require('./adminController/editMtv')
const { DeleteMtv } = require('./adminController/deleteMtv')
const { ADsuggMtv } = require('./adminController/ADsuggMtv')

const adminRouter = express.Router()

adminRouter.post('/loginAdmin', async (req, res) => {
    try{
        const {ident, pass} = req.body
        const token = await Login(ident, pass)
        res.status(200).json(token)
    }
    catch(err){
        returnError(err, res)
    }
})

adminRouter.post('/addMtv',VerifyAdmin , async (req, res) => {

    try{
        const mtv_id = await AddMtv(req.body)
        res.status(200).json(mtv_id)
    }
    catch(err){
        returnError(err, res)
    }

})  

adminRouter.put('/editMtv', VerifyAdmin, async (req, res) => {
    try{
        const mtv_id = await EditMtv(req.body)
        res.status(200).json(mtv_id)
    }
    catch(err){
        returnError(err, res)
    }
})

adminRouter.delete('/deleteMtv', VerifyAdmin, async(req, res) => {
    try{
        const done = await DeleteMtv(req.body.id)
        res.status(200).json({done: done})
    }
    catch(err){
        returnError(err, res)
    }
})

adminRouter.post('/setSuggMtv', VerifyAdmin, async (req, res) => {
    try{
        const done = await ADsuggMtv(req.body)
        res.status(200).json({done})
    }
    catch(err){
        returnError(err, res)
    }
})


module.exports = adminRouter;