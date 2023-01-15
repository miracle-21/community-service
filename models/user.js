const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    pw: {
        type: String,
        required: true
    }
},  { versionKey : false } )

const User = mongoose.model('User', userSchema);

module.exports = User;