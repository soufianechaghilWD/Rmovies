const mongoose = require('mongoose')


const schema = mongoose.Schema

const commentSchema = new schema({
    content: String
})


const CommentModel = mongoose.model('Comment', commentSchema)


const CreateComment = async (comm) => {
    try{
        const cmt = new CommentModel({
            content: comm
        })
        await cmt.save()
        return {id: cmt._id}    
    }
    catch(err){
        return {message: err.message}
    }
}

const DoesCommentExist = async (id) => {
    try{
        const cmt = await CommentModel.findById(id)
        if (cmt === null) return false

        return true
    }
    catch(err){
        return false
    }
}

const DeleteComment = async (id) => {
    try{
        const doesExist = await DoesCommentExist(id)
        if(!doesExist) return {done: false, message: "Comment does not exist"}

        const deletedCmt = await CommentModel.deleteOne({_id: id})
        if(deletedCmt.deletedCount === 1) return {done: true}

        return {done: false}
    }
    catch(err){
        return {done: false, message: err.message}
    }
}

const EditComment = async (id, newcomment) => {
    try{
        const doesExist = await DoesCommentExist(id)
        if(!doesExist) return {done: false, message: "Comment does not exist"}
        
        const Cmt = await CommentModel.findById(id)

        Cmt.content = newcomment
        await Cmt.save()
        return {done: true}
    }
    catch(err){
        return {done: false, message: err.message}
    }
}


module.exports = {CommentModel, CreateComment, DoesCommentExist, DeleteComment, EditComment}