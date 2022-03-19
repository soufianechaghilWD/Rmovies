const { UserModel, IsUserNameAlreadyExists, CreateNewUser } = require('../../model/user')
const bcrypt = require('bcrypt')

module.exports.Register = async (email, username, password) => {

    // check if the username already exists
    const check = await IsUserNameAlreadyExists(username)
    if(check){
        throw({message: 'Username already exists', status: 409})
    }

    // hash the password
    const crypted_pass = await bcrypt.hash(password, 10)

    
    const user_id = await CreateNewUser(email, username, crypted_pass)
    return {id: user_id}
}