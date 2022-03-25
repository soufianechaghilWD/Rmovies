const mongoose = require('mongoose')

const schema = mongoose.Schema

const mtvSchema = new schema({
    name: String,
    gendar: {type: String, enum: ["romance", "drama", "comedy", "action", "fantasy", "horror", "mystery"]},
    description: String,
    picture: String,
    type: {type: String, enum: ["movie", 'tvShow']},
    rate: {type: Number, default: 5 },
    length: {type: Number, default: null},
    seasons: {type: Number, default: null},
    episodes: {type: Number, default: null},
    likers: [{type: schema.Types.ObjectId, ref: "User"}],
    comments: [{type: schema.Types.ObjectId, ref: "Comment"}]
})

const MtvModel = mongoose.model("Mtv", mtvSchema)


const IsMtvAlreadyExist = async (name) => {
    const mtv = await MtvModel.findOne({name})

    if (mtv === null) return false

    return true
}

const IsMtvAlreadyExistById = async (id) => {

    try{
        const mtv = await MtvModel.findById(id)

        if (mtv === null) return {done: false, message: null}

        return {done: true}

    }
    catch(err){
        return {done: false, message: err.message}
    }
}


const CreateNewMtv = async (data) => {
    try{
        const mtv = new MtvModel({...data})

        await mtv.save()
        return {id: mtv._id}
    }
    catch(err){
        return {message: err.message}
    }
}

const UpdateMtv = async (data) => {

    try{
        const ele = await MtvModel.findById(data.id)

        const keys = Object.keys(data)
        for(let i = 0; i < keys.length; i++){
            if(keys[i] !== "id" && keys[i] !== "token") {
                ele[keys[i]] = data[keys[i]]
            }
        }

        await ele.save()
        return {id: ele._id}   
    }
    catch(err){
        return {message: err.message}
    }
}

const DeleteMtv = async (id) => {
    try{
        const deleteEle = await MtvModel.deleteOne({_id: id})
        if(deleteEle.deletedCount === 1) return {done: true}
        else return {done: false}
    }
    catch(err){
        return {done: false, message: err.message}
    }
}

const GetAnMtv = async (id) => {
    try{
        const mtv = await MtvModel.findById(id)
        return {done: true, mtv: mtv}
    }
    catch(err){
        return { done: false, message: err.message}
    }
}


const RateMtv = async (id, rate) => {
    try{
        // get the mtv
        const mtv = await GetAnMtv(id)
        mtv.mtv.rate = (mtv.mtv.rate+rate) / 2
        await mtv.mtv.save()
        return { done : true }
    }
    catch(err){
        return {message: err.message}
    }
}

module.exports = {MtvModel, IsMtvAlreadyExist, CreateNewMtv, IsMtvAlreadyExistById, UpdateMtv, DeleteMtv, GetAnMtv, RateMtv}