const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    phoneNumber:{
        type:String,
        required:[true,"Please fill your phoneNumber"]
    },
    passWord:{
        type: String,
        required: [true, "Please fill your password"],
        minLength: 6,
        select: true,
    }
})
accountSchema.methods.correctPassword = async function(
    typedPassword,
    originalPassword,
  ) {
    return await bcrypt.compare(typedPassword, originalPassword);
};
module.exports = mongoose.model("Account",accountSchema);
