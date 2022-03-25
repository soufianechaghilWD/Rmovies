const { IsUserNameAlreadyExists, GetPasswordOfAccount } = require('../../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports.LoginUser = async (username, password) => {
    
    // check the account exists or not
    const check = await IsUserNameAlreadyExists(username)
    if(check === false) {
        throw({message: "Account does not exist", status: 404})
    }

    // get the password of the account
    const pass = await GetPasswordOfAccount(username)

    // check the password
    const compare = await bcrypt.compare(password, pass)

    if(!compare){
        throw({message: "Incorrect password", status: 403})
    }

    // Assign JWT and send it back 
    const token =   jwt.sign({username: username}, "JwtSecret", {expiresIn: "7d"})
    return {token: token}
}