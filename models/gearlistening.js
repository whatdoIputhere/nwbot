const mongoose = require('mongoose');

const gearSchema = mongoose.Schema({
    listeningid: String,
    userid: String, 
    messageid: String, 
    type: String,
    score: Number,
    url: String,
    price: Number,
    gear: Object,
    status: String
});

module.exports = mongoose.model('gear', gearSchema, 'market');