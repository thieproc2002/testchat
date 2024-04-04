const mongoose = require('mongoose');

const Schema = mongoose.Schema

const messageSchema = new Schema(
    {
        content:{
            type:String,
            default:null
        },
        imageLink:[
            {
                type:String,
                default:null
            }
        ],
        fileLink:{
            type:String,
            default:null
        },
        conversationID:{
            type: Schema.Types.ObjectId,
            required:[true,"Please fill conversationID"],
            ref:'Conversation'
        },
        senderID : { 
            type: Schema.Types.ObjectId, 
            required:[true,"Please fill senderID"],
            ref: 'User' 
        },
        action:String,
        deleteBy: [
            {
                type:Schema.Types.ObjectId,
                default:null
            }
        ],
        seen: [
            {
                type:Schema.Types.ObjectId,
                ref: 'User' ,
                default:null
            }
        ]
    },
    {
        timestamps:true
    }
)

module.exports = mongoose.model("Message",messageSchema);