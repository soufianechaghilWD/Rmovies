const mongoose = require('mongoose')
const { IsMtvAlreadyExist } = require('./mtv')

const schema = mongoose.Schema

const suggMtv = new schema({
    name: String,
    gendar: {type: String, enum: ["romance", "drama", "comedy", "action", "fantasy", "horror", "mystery"]},
    description: String,
    picture: String,
    type: {type: String, enum: ["movie", 'tvShow']},
    rate: {type: Number, default: 0 },
    length: {type: Number, default: null},
    seasons: {type: Number, default: null},
    episodes: {type: Number, default: null},
    status: {type: String, enum: ['pending', 'aproved', 'denied'], default: "pending"}
})


const SuggMtvModel = mongoose.model('SuggMtv', suggMtv)


const GetASuggMtv = async (id) => {
    try{
        const suggMtv = await SuggMtvModel.findById(id)
        if(!suggMtv) return {message: "SuggMtv does not exist"}

        return { suggmtv: suggMtv}
    }
    catch(err){
        return {message: err.message}
    }
}

const IsSuggMtvExist = async (name) => {
    const suggmtv = await SuggMtvModel.findOne({name})
    if(suggmtv === null) return false

    return true
}


const CreateSuggMtv = async (data) => {
    try{
        // check if the mtv already exist
        const mtv = await IsMtvAlreadyExist(data.name)
        if(mtv) return {message: "Mtv already exist"}

        // check if the suggMtv already exist
        const SuggMtv = await IsSuggMtvExist(data.name)
        if(SuggMtv) return {message: "SuggMtv already exist"}

        const suggmtv = new SuggMtvModel({...data})
        await suggmtv.save()
        return {id: suggmtv._id}
    }
    catch(err){
        return {message: err.message}
    }
}

const SetSuggMtvStatus = async (id, status) => {
    
    try{
        // get the sugg mtv
        const suggMtv = await GetASuggMtv(id)
        if(suggMtv.message) return {message: suggMtv.message}

        suggMtv.suggmtv.status = status
        await suggMtv.suggmtv.save()
        return {done: true}
    }
    catch(err){
        return {message: err.message}
    }
}


const DeleteSuggMtv = async (id) => {

    try{
        // check if the sugg mtv exist
        const doesSuggExist = await SuggMtvModel.findById(id)
        if(!doesSuggExist) return {message: "the suggmtv does not exist"}

        // delete the sugg mmtv
        const deletedSuggMtv = await SuggMtvModel.deleteOne({_id: id})
        if(deletedSuggMtv.deletedCount === 1) return {done: true}

        return {message: "Could not delete suggMtv"}
    }
    catch(err){
        return {message: err.message}
    }
}

module.exports = {SuggMtvModel, CreateSuggMtv, GetASuggMtv, SetSuggMtvStatus, IsSuggMtvExist, DeleteSuggMtv}