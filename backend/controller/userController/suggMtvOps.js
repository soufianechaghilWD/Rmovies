const { CreateSuggMtv, GetASuggMtv, DeleteSuggMtv } = require("../../model/suggestionMtv")
const { GetAUser } = require("../../model/user")


const AddSuggMtv = async (data) => {
    // add the sugg mtv
    const done = await CreateSuggMtv(data)

    if(done.message) throw({status: 404, message: done.message || 'Could not add the sugg mtv'})


    // associate the sugg mtv to the user
    const user = await GetAUser(data.suggester)
    if(!user.done) throw({status: 404, message: user.message || "Could not get the user"})
    user.user.suggestionList.push(done.id)
    await user.user.save()
    return done
}

const RemoveSuggMtv = async (userId, suggMtvId) => {
    // check if user is the suggester
    const suggmtv = await GetASuggMtv(suggMtvId)
    if(suggmtv.message) throw({status: 404, message: suggmtv.message || 'An error has occured when retrieving the suggmtv'})

    if(!suggmtv.suggmtv.suggester.equals(userId)) throw({status: 404, message: "You could not delete a sugg mtv that you did not suggest"})

    // delete and remove from the user suggestion list
    const deletedSuggMtv = await DeleteSuggMtv(suggMtvId)
    if(deletedSuggMtv.message) throw({status: 404, message: deletedSuggMtv.message || "An error has occured when deleting the sugg mtv"})

    const user = await GetAUser(userId)
    if(!user.done) throw({status: 404, message: user.message || "Could not get the user"})

    const mtvsuggIdx = user.user.suggestionList.indexOf(suggMtvId)
    if(mtvsuggIdx > -1) user.user.suggestionList.splice(mtvsuggIdx, 1)
    await user.user.save()

    return true

}


module.exports = { AddSuggMtv, RemoveSuggMtv }