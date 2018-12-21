var mongoose = require('mongoose')

var artilcesModel = mongoose.model('article', mongoose.Schema({
    "title": String,
    "date": String,
    "viewer": Array,
    "lover": Array,
    "comment": Number,
    "tag": String,
    "pinned": Boolean,
    "img": Array,
    "content": String
}))

module.exports = artilcesModel;