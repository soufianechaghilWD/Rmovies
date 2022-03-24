const db = require('./db')
const Config = require("../config");
const { Login } = require('../controller/adminController/login');
const { AddMtv } = require('../controller/adminController/addMtv');
const { Register } = require('../controller/userController/register');
const { LoginUser } = require('../controller/userController/login');
const { LikeMtv, CommentMtv, DeleteComment, UpdateComment } = require('../controller/userController/likesCommentsOper');
const { MtvModel } = require('../model/mtv');
const { DoesCommentExist, CommentModel } = require('../model/comment');


var mongod;

beforeAll(async () => mongod = await db.connect())
afterEach(async () => await db.clearDatabase())
afterAll(async () => await db.closeDatabase(mongod))

// admin data
const adminData = Config.adminData;
const { admin, adminPass } = adminData;


// mtv data
const mtvData = {
    name: "game of tests",
    gendar: "action",
    description: "best in the world",
    picture: "pic.png",
    type: "tvShow",
    seasons: 7,
    episodes: 67,
};


// User data
const userData = {email: "test@gmail.com", username: "test", password: "test"}
const {email, username, password} = userData

// adminToken
var adminToken;

// User Token
var userToken;

// Mtv id
var postId;

// User id
var userId;

// Comment
const comment = "this is a comment"

// Comment id
var commentId;

describe('Login Admin / Create Mtv / Register User / Login User', () => {
    it('Should login the admin', async () => {
        const { token }= await Login(admin, adminPass)
        expect(typeof token).toBe("string");
        adminToken = token;
    })
    it('Should craete an Mtv', async () => {
        const { id } = await AddMtv(mtvData)
        postId = id;
    })
    it('Should register the user', async () => {
        const { id } = await Register(email, username, password)
        userId = id;
    })
    it("Should login the user", async () => {
        const { token } = await LoginUser(username, password)
        userToken = token;
    })

})


describe('Like an mtv', () => {
    it('Should return mtv does not exist', async () => {
        try{
            const done = await LikeMtv(userId, postId+"wrong")
        }
        catch(err) {
            expect(err.status).toEqual(404)
        }
    })
    it('Should return user does not exist', async () => {
        try{
            const done = await LikeMtv(userId+"wrong", postId)
        }
        catch(err){
            expect(err.status).toEqual(400)
            expect(err.message).toEqual("User Does not exist")
        }
    })
    it('Should like the post', async () => {
        const done = await LikeMtv(userId, postId)
        expect(typeof done).toEqual('boolean')

        const mtv = await MtvModel.findById(postId)
        expect(mtv.likers).toContainEqual(userId)
    })
    it('Should return user already likes this post', async () => {
        try{
            const done = await LikeMtv(userId, postId)
        }
        catch(err){
            expect(err.status).toEqual(409)
            expect(err.message).toEqual('User already likes the mtv')
        }
    })
})


describe('Comment an mtv', () => {
    it('Should return post does not exist', async () => {
        try{
            const done = await CommentMtv(userId, postId+"wrong", comment)
        }
        catch(err){
            expect(err.status).toEqual(404)
        }
    })
    it('Should return user does not exist', async () => {
        try{
            const done = await CommentMtv(userId+"wrong", postId, comment)
        }
        catch(err){
            expect(err.status).toEqual(404)
            expect(err.message).toEqual('User Does not exist')
        }
    })
    it('Should add comment', async () => {
        const cmt = await CommentMtv(userId, postId, comment)
        const mtv = await MtvModel.findById(postId)
        expect(mtv.comments).toContainEqual(cmt.cmtId)
        commentId = cmt.cmtId
    })
})


describe('Edit the comment', () => {
    it('Should return post does not exist', async () => {
        try{
            const done = await CommentMtv(userId, postId+"wrong", comment)
        }
        catch(err){
            expect(err.status).toEqual(404)
        }
    })
    it('Should return user does not exist', async () => {
        try{
            const done = await CommentMtv(userId+"wrong", postId, comment)
        }
        catch(err){
            expect(err.status).toEqual(404)
            expect(err.message).toEqual('User Does not exist')
        }
    })
    it('Should return comment does not exist', async () => {
        try{
            const done = await DeleteComment(userId, postId, commentId+"wrong")
        }
        catch(err){
            expect(err.status).toEqual(404)
            expect(err.message).toEqual('Comment does not exist')
        }
    })
    it('Should update the comment', async () => {
        const cmt = await UpdateComment(userId, postId, commentId, "this is a new comment")
        const newCmt = await CommentModel.findById(cmt.cmtId)
        expect(newCmt.content).toEqual('this is a new comment')
    })
})

describe('Delete a comment', () => {
    it('Should return post does not exist', async () => {
        try{
            const done = await CommentMtv(userId, postId+"wrong", comment)
        }
        catch(err){
            expect(err.status).toEqual(404)
        }
    })
    it('Should return user does not exist', async () => {
        try{
            const done = await CommentMtv(userId+"wrong", postId, comment)
        }
        catch(err){
            expect(err.status).toEqual(404)
            expect(err.message).toEqual('User Does not exist')
        }
    })
    it('Should return comment does not exist', async () => {
        try{
            const done = await DeleteComment(userId, postId, commentId+"wrong")
        }
        catch(err){
            expect(err.status).toEqual(404)
            expect(err.message).toEqual('Comment does not exist')
        }
    })
    it("Should delete the comment", async () => {
        const done = await DeleteComment(userId, postId, commentId)
        expect(done).toBeTruthy()
        const mtv = await MtvModel.findById(postId)
        expect(!mtv.comments.includes(commentId)).toBeTruthy()
        const cmt = await DoesCommentExist(commentId)
        expect(!cmt).toBeTruthy()
    })
})