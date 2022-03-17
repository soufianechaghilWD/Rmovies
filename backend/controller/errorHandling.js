const returnError = (err, res) => {
    var status;
    if(err.status) status = err.status
    else status = 400

    res.status(status).json({
        message: err.message
    })
}

module.exports = {returnError}