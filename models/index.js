var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/dz')

// get means only return 1, use findOne
// find means return array, use find & query

exports.User = require('./user') // pascal named because it is collection
exports.Post = require('./post')
exports.Section = require('./section')




