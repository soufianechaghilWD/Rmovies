const db = require('./db')
const { Register }  = require('../controller/userController/register')
const { LoginUser }  = require('../controller/userController/login')
const { UserModel } = require('../model/user')


var mongod;

beforeAll(async () => mongod = await db.connect())
afterEach(async () => await db.clearDatabase())
afterAll(async () => await db.closeDatabase(mongod))

const userData = {email: "test@gmail.com", username: "test", password: "test"}
const wrongUserData = {wrongEmail: "test1@gmail.com", wrongUsername: "test1", wrongPassword: "test1"}
// test data
const {email, username, password} = userData
const {wrongEmail, wrongUsername, wrongPassword} = wrongUserData


describe('User test', () => {
    it('Register a user goes as expected', async () => {

        // get the id of the added user
        const {id} = await Register(email, username, password)
        const user = await UserModel.findById(id)

        // Test if the user is added to the DB
        expect(user.username).toEqual('test')
        expect(user.email).toEqual('test@gmail.com')

    })
    it("Register User / Username already exists", async () => {

        try{
            const {id} = await Register(email, username, password)
        }
        catch(err) {
            expect(err.status).toEqual(409)
            expect(err.message).toEqual('Username already exists')
        }

    })
    it('Login User goes as expected', async () => {

        const {token} = await LoginUser(username, password)
        expect(typeof token).toBe("string")

    })
    it('Login User / User does not exists', async () => {
        
        try{
            const {data} = await LoginUser(wrongUsername, password)
        }
        catch(err){
            expect(err.status).toEqual(404)
            expect(err.message).toEqual("Account does not exist")
        }
    })
    it('Login User / password Incorrect', async () => {
        
        try{
            const {data} = await LoginUser(username, wrongPassword)
        }
        catch(err){
            expect(err.status).toEqual(403)
            expect(err.message).toEqual("Incorrect password")
        }
    })
})