const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')



// connect to db
module.exports.connect = async () => {

    const mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
    await mongoose.connect(uri, mongooseOpts)
    return mongod
}

// disconnect and close connection
module.exports.closeDatabase = async (mongod) => {

    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    mongod.stop()
}

// clear the db, remove all data
module.exports.clearDatabase = async () => {

    const collections = mongoose.connection.collection
    for (const key in collections) {
        const collection = collections[key]
        await collection.deleteMany()
    }
}