const Config = require('../../config')
const jwt = require('jsonwebtoken')

module.exports.Login = async (ident, pass) => {

    // test if everything is okay
    if(ident !== Config.adminData.admin){
        throw({message: "Incorrect identifier", status: 403})
    }

    if(pass !== Config.adminData.adminPass){
        throw({message: "Incorrect Password", status: 403})
    }

    // return a token
    const token = jwt.sign({username: ident}, "JwtSecret", {expiresIn: "7d"})
    return {token: token}
}