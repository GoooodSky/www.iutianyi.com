var mongoose = require('mongoose')

var visitorsModel = mongoose.model('visitor', mongoose.Schema({
    "ip": String,
    "date": String,
    "agent": String,
}))

module.exports = visitorsModel;