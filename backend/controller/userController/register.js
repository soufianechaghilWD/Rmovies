const { UserModel, IsUserNameAlreadyExists } = require('../../model/user')
const bcrypt = require('bcrypt')

module.exports.Register = async (email, username, password) => {

    // check if the username already exists
    const check = await IsUserNameAlreadyExists(username)
    if(check){
        throw({message: 'Username already exists', status: 409})
    }

    // hash the password
    const crypted_pass = await bcrypt.hash(password, 10)


    const user = new UserModel({
        email,
        username,
        password: crypted_pass
    })
    await user.save()
    return {id: user._id}
}