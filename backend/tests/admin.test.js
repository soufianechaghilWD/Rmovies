const db = require("./db");
const { Login } = require("../controller/adminController/login");
const Config = require("../config");
const { AddMtv } = require("../controller/adminController/addMtv");
const { MtvModel } = require("../model/mtv");
const { EditMtv } = require("../controller/adminController/editMtv");
const { DeleteMtv } = require("../controller/adminController/deleteMtv");

var mongod;

beforeAll(async () => (mongod = await db.connect()));
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase(mongod));

// correct data
const adminData = Config.adminData;
const { admin, adminPass } = adminData;

// Incorrect data
const wrongAdminData = { wrongIdent: "test", wrongPass: "test" };
const { wrongIdent, wrongPass } = wrongAdminData;

const mtvData = {
  name: "game of tests",
  gendar: "action",
  description: "best in the world",
  picture: "pic.png",
  type: "tvShow",
  seasons: 7,
  episodes: 67,
};

var gloablId;

describe("Admin tests", () => {
  it("Login admin / wrong identifier", async () => {
    try {
      const data = await Login(wrongIdent, adminPass);
    } catch (err) {
      expect(err.status).toEqual(403);
      expect(err.message).toEqual("Incorrect identifier");
    }
  });
  it("Login admin / wrong password", async () => {
    try {
      const data = await Login(admin, wrongPass);
    } catch (err) {
      expect(err.status).toEqual(403);
      expect(err.message).toEqual("Incorrect Password");
    }
  });
  it("Login admin / correct info", async () => {
    const { token } = await Login(admin, adminPass);
    expect(typeof token).toBe("string");
  });
});

describe("Create an Mtv", () => {
  it("Should return gendar invalid", async () => {
    try {
      const newMtvData = Object.assign({}, mtvData);
      newMtvData.gendar = "Invalid gendar";
      const { id } = await AddMtv(newMtvData);
    } catch (err) {
      expect(err.status).toEqual(400)
    }
  });
  it("should go smooth", async () => {
    const { id } = await AddMtv(mtvData);

    // set the global id
    gloablId = id;

    const mtv = await MtvModel.findById(id);

    expect(mtv.name).toEqual("game of tests");
    expect(mtv.gendar).toEqual("action");
    expect(mtv.description).toEqual("best in the world");
    expect(mtv.picture).toEqual("pic.png");
    expect(mtv.type).toEqual("tvShow");
    expect(mtv.seasons).toEqual(7);
    expect(mtv.episodes).toEqual(67);
    expect(mtv.rate).toEqual(5);
    expect(mtv.length).toEqual(null);
  });
  it("should return element already exists", async () => {
    try {
      const { id } = await AddMtv(mtvData);
    } catch (err) {
      expect(err.status).toEqual(409);
      expect(err.message).toEqual("Mtv Already Exist");
    }
  });
});

describe("Update an Mtv", () => {
  it("Should return no element with the submitted id", async () => {
    const newData = Object.assign({}, mtvData);
    newData.id = "wrongId";

    try {
      const { id } = await EditMtv(newData);
    } catch (err) {
      expect(err.status).toEqual(404)
    }
  });
  it("Should update the mtv", async () => {
    const newData = {
      id: gloablId,
      name: "Updated game of tests",
      picture: "Updatedpic.png",
    };
    const {id} = await EditMtv(newData)

    const mtv = await MtvModel.findById(id)
    expect(mtv.name).toEqual('Updated game of tests')
    expect(mtv.picture).toEqual('Updatedpic.png')
  });
});

describe('Delete an Mtv', () => {
    it('Should delete the item', async () => {
        const done = await DeleteMtv(gloablId)
        expect(typeof done).toEqual("boolean")

        const mtv = await MtvModel.findById(gloablId)
        expect(mtv).toEqual(null)
    })
    it('Should return element does not exist', async () => {
        try{
            const done = await DeleteMtv(gloablId)
        }
        catch(err){
            expect(err.status).toEqual(404)
            expect(err.message).toEqual('Element Does not exist')
        }
    })
})