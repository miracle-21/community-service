const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    created_at: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    view: {
        type: Number
    }
},  { versionKey : false } )

const Post = mongoose.model('Post', postSchema);

module.exports = Post;