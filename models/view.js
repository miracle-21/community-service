const mongoose = require('mongoose');

const viewSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: new Date()
    },
    post_id: {
        type: Number
    },
    ip_address: {
        type: String,
        required: true
    }
},  { versionKey : false } )

viewSchema.index( { createdAt: 1 }, { expireAfterSeconds: 86400 } );
const View = mongoose.model('View', viewSchema);

module.exports = View;