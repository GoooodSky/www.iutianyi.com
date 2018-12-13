var mongoose = require('mongoose')

var projectsModel = mongoose.model('project', mongoose.Schema())

module.exports = projectsModel;