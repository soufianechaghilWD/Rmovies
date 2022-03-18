const jwt = require('jsonwebtoken')


module.exports.VerifyAdmin = async (req, res, next) => {
    // Get the token
    const token = req.body.token || req.params.token || req.headers["x-access-token"]

    // check if the token does not exist
    if(!token) {
        res.status(401).json({message: "token is missing"})
    }

    jwt.verify(token, "JwtSecretAdmin", (err, decode) => {
        if(err) res.status(401).json({message: "Invalid Token"})
        console.log(decode)
        next()
    })

}

