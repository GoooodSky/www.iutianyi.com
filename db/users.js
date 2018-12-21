var mongoose = require('mongoose')

var artilcesModel = mongoose.model('user', mongoose.Schema({
    "name": String,
    "password": String,
}))

module.exports = artilcesModel;