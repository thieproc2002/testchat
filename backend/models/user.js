const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName : {
        type:String,
        required:[true,"Please fill your fullname"]
    },
    bio:{
        type:String,
        default:null
    },
    gender:{
        type:Number,
        required:[true,"Please fill your gender"],
        // 0 là nam , 1 là nữ
        default: 0
    },
    birthday: {
        type:Date,
        required:[true,"Please fill your birthday"],
        default:Date.now()
    },
    status:{
        type:Boolean,
        default:true
    },
    avatarLink:{
        type:String,
        default:"https://mechat.s3.ap-southeast-1.amazonaws.com/avarNam.jpg"
    },
    backgroundLink:{
        type:String,
        default:"https://mechat.s3.ap-southeast-1.amazonaws.com/background.jpg"
    },
    accountID : { 
        type: Schema.Types.ObjectId, 
        required:[true,"Please fill acountID"],
        ref: 'Account' 
    },
    friends:[
        {
            type:Schema.Types.ObjectId,
            ref:'Friend', 
            default:null
        }
    ],
    warning: {
        type: Number,
        default: 0
    },
    role:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model("User",userSchema);