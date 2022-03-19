const { IsMtvAlreadyExist, CreateNewMtv } = require('../../model/mtv')


module.exports.AddMtv = async (data) => {
    // See if the mtv already exist
    const alreadyExist = await IsMtvAlreadyExist(data.name)
    if(alreadyExist) throw({message: 'Mtv Already Exist', status: 409})

    // Create new Mtv
    const returnData = await CreateNewMtv(data)

    if(!returnData.id) throw({message: returnData.message, status: 400})

    return {id: returnData.id}
}