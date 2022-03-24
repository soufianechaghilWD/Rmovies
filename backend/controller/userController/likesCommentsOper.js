const { IsMtvAlreadyExistById, GetAnMtv } = require('../../model/mtv')
const { DoesUserExist, GetAUser } = require('../../model/user')
const { CreateComment, RemoveComment, EditComment } = require('../../model/comment')


const LikeMtv = async (userId, postId) => {

    const doesMtvExist = await IsMtvAlreadyExistById(postId)
    if(!doesMtvExist.done) throw({status: 404, message: doesMtvExist.message || "Mtv does not exist"})

    const mtv = await GetAnMtv(postId)
    if(!mtv.done) throw({status: 404, message: mtv.message})

    const user = await DoesUserExist(userId)
    if(!user) throw({status: 400, message: "User Does not exist"})

    if(mtv.mtv.likers.includes(userId)) throw({status: 409, message: "User already likes the mtv"})

    mtv.mtv.likers.push(userId)
    await mtv.mtv.save()
    return true
}


const CommentMtv = async (userId, postId, comment) => {

    // check if the post exist
    const doesMtvExist = await IsMtvAlreadyExistById(postId)
    if(!doesMtvExist.done) throw({status: 404, message: doesMtvExist.message || "Mtv does not exist"})

    // check if the user exist
    const user = await DoesUserExist(userId)
    if(!user) throw ({status: 404, message: "User Does not exist"})

    // create a comment
    const cmtId = await CreateComment(comment)
    if(cmtId.message) throw({status: 400, message: cmtId.message}) 

    // associate the comment to the post
    const mtv = await GetAnMtv(postId)
    if(!mtv.done) throw({status: 404, message: mtv.message})
    mtv.mtv.comments.push(cmtId.id)
    await mtv.mtv.save()
    return {cmtId: cmtId.id}
}

const UpdateComment = async (userId, postId, commentId, newComment) => {
    // check the post exist
    const doesMtvExist = await IsMtvAlreadyExistById(postId)
    if(!doesMtvExist.done) throw({status: 404, message: doesMtvExist.message || "Mtv does not exist"})

    // check if the user exist
    const user = await DoesUserExist(userId)
    if(!user) throw ({status: 404, message: "User Does not exist"})

    // update the comment
    const updatedCmt = await EditComment(commentId, newComment)
    if(!updatedCmt.done) throw({status: 400, message: updatedCmt.message || "Could not update the comment"})

    return {cmtId: commentId}
} 


const DeleteComment = async (userId, postId, commentId) => {
    
    // check the post exist
    const doesMtvExist = await IsMtvAlreadyExistById(postId)
    if(!doesMtvExist.done) throw({status: 404, message: doesMtvExist.message || "Mtv does not exist"})

    // check if the user exist
    const user = await DoesUserExist(userId)
    if(!user) throw ({status: 404, message: "User Does not exist"})

    // delete the comment
    const deletedCmt = await RemoveComment(commentId)
    if(!deletedCmt.done) throw({message: deletedCmt.message || "Could not delete comment", status: 404})

    // remove the comment from the mtv
    const mtv = await GetAnMtv(postId)
    const cmtIdx = mtv.mtv.comments.indexOf(commentId)
    if(cmtIdx > -1) mtv.mtv.comments.splice(cmtIdx, 1)
    await mtv.mtv.save()
    return true
}

const addToFavoriteList = async (userId, postId) => {
    // check if the post exist
    const doesMtvExist = await IsMtvAlreadyExistById(postId)
    if(!doesMtvExist.done) throw({status: 404, message: doesMtvExist.message || "Mtv does not exist"})

    // add the post to favorite list
    const user = await GetAUser(userId)

    if(!user.done) throw({status: 404, message: user.message || "Could not get the user"})

    if(user.user.favoriteList.includes(postId)) throw({status: 409, message: "Mtv already in favorite list"})

    user.user.favoriteList.push(postId)
    await user.user.save()
    return true
}

module.exports = {LikeMtv, CommentMtv, DeleteComment, UpdateComment, addToFavoriteList}