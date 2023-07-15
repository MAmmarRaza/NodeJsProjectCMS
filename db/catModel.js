const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    posts: Number
});

module.exports = mongoose.model('categories',catSchema);
//nothign comment isdjfasdfsdf