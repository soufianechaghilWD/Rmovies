const express = require('express')
const { Register } = require('./userController/register')
const { LoginUser } = require('./userController/login')
const userRouter = express.Router()
const { returnError } = require('./errorHandling')
const { Verify } = require('./userController/verifyJwt')
const { LikeMtv, CommentMtv, DeleteComment, UpdateComment, addToFavoriteList } = require('./userController/likesCommentsOper')
const { AddSuggMtv, RemoveSuggMtv } = require('./userController/suggMtvOps')

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

userRouter.post('/login', async (req, res, next) => {
    try{
        const {username, password} = req.body
        const token = await LoginUser(username, password)
        res.status(200).json(token)
    }
    catch(err){
        returnError(err, res)
    }
})

userRouter.post('/likeMtv', Verify, async (req, res, next) => {
    try{
        const {userId, postId} = req.body
        const cmt = await LikeMtv(userId, postId)
        res.status(200).json(cmt)
    }
    catch(err){
        returnError(err, res)
    }
})

userRouter.post('/commentMtv', Verify, async (req, res, next) =>  {
    try{
        const {userId, postId, comment} = req.body
        const done = await CommentMtv(userId, postId, comment)
        res.status(200).json(done)
    }
    catch(err){
        returnError(err, res)
    }
})

userRouter.put('/updateComment', Verify, async (req, res, next) => {
    try{
        const {userId, postId, commentId, newComment} = req.body
        const cmt = await UpdateComment(userId, postId, commentId, newComment)
        res.status(200).json(cmt)
    }
    catch(err){
        returnError(err, res)
    }
})

userRouter.put('/addToFavouriteList', Verify, async (req, res, next) => {
    try{
        const {userId, postId} = req.body
        const done = await addToFavoriteList(userId, postId)
        res.status(200).json({done})
    }
    catch(err){
        returnError(err, res)
    }
})

userRouter.delete('/deleteComment', Verify, async (req, res, next) => {
    try{
        const {userId, postId, commentId} = req.body
        const done = await DeleteComment(userId, postId, commentId)
        res.status(200).json({done})
    }
    catch(err){
        returnError(err, res)
    }
})

userRouter.post('/addSuggMtv', Verify, async (req, res, next) => {
    try{
        const done = await AddSuggMtv(req.body)
        res.status(200).json(done)
    }
    catch(err){
        returnError(err, res)
    }
})

userRouter.delete('/deleteSuggMtv', Verify, async (req, res, next) => {
    try{
        const {userId, suggMtvId} = req.body
        const done = await RemoveSuggMtv(userId, suggMtvId)
        res.status(200).json({done})
    }
    catch(err){
        returnError(err, res)
    }
})


module.exports = userRouter