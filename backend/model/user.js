const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: String,
    username: String,
    profilePic: {type: String, default: "default_url_pic.png"},
    password: String,
    favouriteList: [{type: Schema.Types.ObjectId, ref: "M/TV"}],
    suggestionList: [{type: Schema.Types.ObjectId, ref: "Suggestion"}]
})


const UserModel = mongoose.model('User', userSchema)

const IsUserNameAlreadyExists = async (username) => {
    const User = await UserModel.findOne({username})

    if (User === null) return false
    return true

}



module.exports = {UserModel, IsUserNameAlreadyExists}