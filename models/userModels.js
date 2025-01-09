const mongoose = require('mongoose');

const userSchema =new mongoose.Schema({
    firstName : {
        type : String,
        maxlength :32,
    },
    lastName : {
        type :String,
        maxlength :32,
    },
    email: {
        type: String,
        trim: true,
       
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'password is required'],
        minlength: [6, 'password must have at least (6) caracters'],
    },
}, { timestamps: true })

userSchema.methods.comparePassword=function(password){
    return this.password===password;
};

module.exports =mongoose.model("user",userSchema);