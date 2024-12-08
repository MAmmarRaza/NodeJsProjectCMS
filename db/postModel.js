const mongoose=require("mongoose");
const postsSchema=new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    post_date:{
        type:Date,
        required:true,
        default: Date.now
    },
    author: String,
    post_img: String
});

module.exports = mongoose.model('posts',postsSchema);
// 
