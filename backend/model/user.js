const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: String,
    username: String,
    profilePic: {type: String, default: "default_url_pic.png"},
    password: String,
    favoriteList: [{type: Schema.Types.ObjectId, ref: "Mtv"}],
    suggestionList: [{type: Schema.Types.ObjectId, ref: "Suggestion"}]
})


const UserModel = mongoose.model('User', userSchema)

const IsUserNameAlreadyExists = async (username) => {
    const User = await UserModel.findOne({username})

    if (User === null) return false
    return true

}

const GetPasswordOfAccount = async (username) => {

    const user = await UserModel.findOne({username: username})
    return user.password
}

const CreateNewUser = async (email, username, password) => {
    const user = new UserModel({
        email,
        username,
        password
    })
    await user.save()
    return user._id
}

const DoesUserExist = async (id) => {
    try{
        const user = await UserModel.findById(id)
        if(user === null) return false

        return true
    }
    catch(err){
        return false
    }
}

const GetAUser = async (id) => {
    try{
        const user = await UserModel.findById(id)
        return { done: true, user: user}
    }
    catch(err){
        return { done : false, message: err.message}
    }
}



module.exports = {UserModel, IsUserNameAlreadyExists, GetPasswordOfAccount, CreateNewUser, DoesUserExist, GetAUser}
