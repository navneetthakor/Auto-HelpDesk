const mongoose = require('mongoose')
const {Schema} = mongoose

const UserSchema = new Schema({
    
    username:{
        type: String,
        required: true,
    },

    email:{
        type: String,
        required: true,
        unique: true,
    },

    password:{
        type: String,
        required: true,
    },
    
    contact_num:{
        type: String,
        // required: true, (we can't force for mobile number)
    },

    image:{
        type: String
    },

    role: { type: String, default: "user", enum: ["user", "mentor", "admin"] },
    skills: [String],

    // used for password reset
    resetPasswordToken: String,
    resetPasswordExpires: Date,

}, { timestamps: true });

const User = mongoose.model('User', UserSchema)

module.exports = User
