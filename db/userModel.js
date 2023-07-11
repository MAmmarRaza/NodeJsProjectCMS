const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    email:String,
    username:{
        type:String,
        unique:true,
        required:true
    },
    password: String,
    role: Number
});

module.exports = mongoose.model('users',usersSchema);