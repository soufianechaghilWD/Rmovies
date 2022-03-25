const { DeleteMtv, IsMtvAlreadyExistById } = require('../../model/mtv')


module.exports.DeleteMtv = async (id) => {

    // check if the mtv already exist
    const exist = await IsMtvAlreadyExistById(id)
    if(!exist.done) throw({status: 404, message: exist.message || "Element Does not exist"})

    // delete the mtv
    const deleted = await DeleteMtv(id)
    if(!deleted.done) throw({status: 404, message: deleted.message || "Could not delete the element"})

    return true
}