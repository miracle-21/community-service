const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    totalPost: {
        type: Number
    },
    name: {
        type: String,
        required: true
    },
    validPost: {
        type: Number
    }
})

const Counter = mongoose.model("Counter", counterSchema)

module.exports = Counter;