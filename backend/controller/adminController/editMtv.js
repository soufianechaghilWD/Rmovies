const { IsMtvAlreadyExistById, UpdateMtv } = require('../../model/mtv')


module.exports.EditMtv = async (data) => {

    // check if the mtv already exist
    const doesExist = await IsMtvAlreadyExistById(data.id)
    if(!doesExist.done) throw({message: doesExist.message || "Element does not exist", status: 404})

    const updated = await UpdateMtv(data)
    if(!updated.id) throw({message: updated.message})

    return {id: updated.id}
}