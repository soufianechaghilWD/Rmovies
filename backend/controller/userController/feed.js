const { MtvModel } = require("../../model/mtv")

module.exports.Feed = async () => {
    const mtvs = await MtvModel.find()
    return mtvs
}