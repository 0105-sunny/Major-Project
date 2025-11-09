const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose  = require("passport-local-mongoose");

const  userSchema  = new Schema({
    email: {
        type:String,
        required:true
    },
    
});
// here dont need to define the password and username mongoose will automatically add the both the fields
userSchema.plugin(passportLocalMongoose);

module.exports  = mongoose.model(`user`, userSchema)