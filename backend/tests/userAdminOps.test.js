const db = require('./db')
const Config = require("../config");
const { Login } = require('../controller/adminController/login');
const { AddMtv } = require('../controller/adminController/addMtv');
const { Register } = require('../controller/userController/register');
const { LoginUser } = require('../controller/userController/login');
const { LikeMtv, CommentMtv, DeleteComment, UpdateComment, addToFavoriteList } = require('../controller/userController/likesCommentsOper');
const { MtvModel, GetAnMtv } = require('../model/mtv');
const { DoesCommentExist, CommentModel } = require('../model/comment');
const { GetAUser } = require('../model/user');
const { AddSuggMtv, RemoveSuggMtv } = require('../controller/userController/suggMtvOps');
const { GetASuggMtv } = require('../model/suggestionMtv');
const { ADsuggMtv } = require('../controller/adminController/ADsuggMtv');


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

describe('Add mtv to wish list', () => {
    it('Should return post does not exist', async () => {
        try{
            const done = await addToFavoriteList(userId, postId+"wrong")
        }
        catch(err){
            expect(err.status).toEqual(404)
        }
    })
    it('Should return user does not exist', async () => {
        try{
            const done = await addToFavoriteList(userId+"wrong", postId)
        }
        catch(err){
            expect(err.status).toEqual(404)
        }
    })
    it('Should add post to favorite list', async () => {
        const done = await addToFavoriteList(userId, postId)
        expect(done).toBeTruthy()

        const user = await GetAUser(userId)
        expect(user.user.favoriteList).toContainEqual(postId)
    })
    it("Should return mtv already exists in favorite list", async () => {
        try{
            const done = await addToFavoriteList(userId, postId)
        }
        catch(err){
            expect(err.status).toBe(409)
            expect(err.message).toEqual('Mtv already in favorite list')
        }
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

// sugg mtv
const suggMtvData = {
    name: "game of sugg tests",
    gendar: "action",
    description: "best in sugg the world",
    picture: "pic.png",
    type: "tvShow",
    seasons: 7,
    episodes: 67,
    suggester: userId
};

// sugg mtv id
var suggMtvId;

describe('Add Sugg Mtv', () => {
    it('Should return mtv already exist', async () => {
        try{
            const done = await AddSuggMtv(mtvData)
        }
        catch(err){
            expect(err.status).toBe(404)
            expect(err.message).toBe("Mtv already exist")
        }
    })
    it('Should add sugg mtv', async () => {
        suggMtvData.suggester = userId
        const done = await AddSuggMtv(suggMtvData)
        suggMtvId = done.id

        const user = await GetAUser(userId)
        expect(user.user.suggestionList).toContainEqual(suggMtvId)
    })
    it('Should return document already exist in suggMtv', async () => {
        try{
            suggMtvData.suggester = userId
            const done = await AddSuggMtv(suggMtvData)
        }
        catch(err){
            expect(err.status).toBe(404)
            expect(err.message).toBe('SuggMtv already exist')
        }
    })
})

describe('Set Sugg mtv', () => {
    it('Should set the status to denied', async () => {
        const done = await ADsuggMtv(suggMtvId, 'denied')
        expect(done).toBeTruthy()
        const suggmtv = await GetASuggMtv(suggMtvId)
        expect(suggmtv.suggmtv.status).toBe('denied')
    })
    it('Should set the status to approved', async () => {
        const done = await ADsuggMtv(suggMtvId, "aproved")
        expect(done.done).toBeTruthy()
        const mtv = await GetAnMtv(done.id)
        expect(mtv.mtv.name).toBe('game of sugg tests')
        expect(mtv.mtv.gendar).toBe('action')
        expect(mtv.mtv.description).toBe('best in sugg the world')
    })
})

describe('Delete Sugg Mtv', () => {
    it('Should return you are not the suggester', async () => {
        try{
            const done = await RemoveSuggMtv(userId+"wo", suggMtvId)
        }
        catch(err){
            expect(err.status).toBe(404)
            expect(err.message).toBe('You could not delete a sugg mtv that you did not suggest')
        }
    })
    it('Should delete the sugg mtv', async () => {
        const done = await RemoveSuggMtv(userId, suggMtvId)
        expect(done).toBeTruthy()
    
        const user = await GetAUser(userId)
        expect(!user.user.suggestionList.includes(suggMtvId)).toBeTruthy()    
    })
})