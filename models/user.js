const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userid: String, 
    listeningsnumber: {
        type: Number,
        default: 0,
    }
});

module.exports = mongoose.model('User', userSchema, 'users');