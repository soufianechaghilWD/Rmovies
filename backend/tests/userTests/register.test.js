const db = require('../db')
const { Register }  = require('../../controller/userController/register')
const { UserModel } = require('../../model/user')


var mongod;

beforeAll(async () => mongod = await db.connect())
afterEach(async () => await db.clearDatabase())
afterAll(async () => await db.closeDatabase(mongod))

describe('User test', () => {
    it('Register a user', async () => {

        // test data
        const userData = {email: "test@gmail.com", username: "test", password: "test"}
        const {email, username, password} = userData

        // get the id of the added user
        const {id} = await Register(email, username, password)
        const user = await UserModel.findById(id)

        // Test if the user is added to the DB
        expect(user.username).toEqual('test')
        expect(user.email).toEqual('test@gmail.com')

        // Test if we can add a new user if the username is already used
        try{
            const newone = await Register(email, username, password)
        }
        catch(err) {
            expect(err.status).toEqual(301)
            expect(err.message).toEqual('Username already exists')
        }
    })
})