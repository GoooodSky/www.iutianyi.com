var mongoose = require('mongoose')

var artilcesModel = mongoose.model('article', mongoose.Schema({
    "title": String,
    "date": String,
    "view": Number,
    "viewer": Array,
    "love": Number,
    "lover": Array,
    "comment": Number,
    "tag": String,
    "pinned": Boolean,
    "img": String,
    "content": String
}))

module.exports = artilcesModel;