const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendRequestSchema = new Schema({
    senderID: {
        type:Schema.Types.ObjectId, 
        required:[true,"Please fill senderID"],
        ref : "User"
    },
    receiverID:{
        type:Schema.Types.ObjectId,
        required:[true,"Please fill reciverID"],
        ref:"User"
    },
    content:String,
    status:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model("FriendRequest",friendRequestSchema)