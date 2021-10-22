const mongoose = require('mongoose');

const resourceSchema = mongoose.Schema({
    listeningid: String,
    userid: String,
    messageid: String,
    type: String,
    quantity: Number,
    totalprice: Number,
    unitprice: Number,
});

module.exports = mongoose.model('resource', resourceSchema, 'market');