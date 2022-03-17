const db = require('./db')
const { Login } = require('../controller/adminController/login')
const Config = require('../config')

var mongod;

beforeAll(async () => mongod = await db.connect())
afterEach(async () => await db.clearDatabase())
afterAll (async () => await db.closeDatabase(mongod))


// correct data
const adminData = Config.adminData
const {admin, adminPass} = adminData

// Incorrect data
const wrongAdminData = {wrongIdent: 'test', wrongPass: "test"}
const {wrongIdent, wrongPass} = wrongAdminData

describe('Admin tests', () => {
    it('Login admin / wrong identifier', async () => {
        try{
            const data = await Login(wrongIdent, adminPass)
        }
        catch(err){
            expect(err.status).toEqual(403)
            expect(err.message).toEqual('Incorrect identifier')
        }
    })
    it('Login admin / wrong password', async () => {
        try{
            const data = await Login(admin, wrongPass)
        }
        catch(err){
            expect(err.status).toEqual(403)
            expect(err.message).toEqual('Incorrect Password')
        }
    })
    it("Login admin / correct info", async () => {
        const {token} = await Login(admin, adminPass)
        expect(typeof token).toBe('string')
    })
})