const jwt = require('jsonwebtoken')


module.exports.Verify = async (req, res, next) => {
    // Get the token
    const token = req.body.token || req.params.token || req.headers["x-access-token"]

    // check if the token does not exist
    if(!token) {
        return res.status(401).json({message: "token is missing"})
    }

    jwt.verify(token, "JwtSecret", (err, decode) => {
        if(err) return res.status(401).json({message: "Invalid Token"})

        next()
    })

}

