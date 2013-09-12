var mongoose = require('mongoose')
var Id = mongoose.Schema.ObjectId

var SectionSchema = new mongoose.Schema({
  name: {type: String, unique: true},
  description: String,
  visit_count: {type: Number, default: 0},
  post_count: {type: Number, default: 0},
  reply_count: {type: Number, default: 0},
  score: {type: Number, default: 0}, // for sort
  admin: Id,
  create_at: {type: Date, default: Date.now},
  create_by: Id
})

var Section = mongoose.model('sections', SectionSchema)

exports.add = function(section, cb) {
  var _section = new Section(section)
  _section.save(cb)
}

exports.list = function(cb) {
  // always list by score
  Section.find().sort({score: 1}).exec(cb)
}

exports.get = function(id, cb) {
  Section.findOne({_id: id}, cb)
}

exports.getByName = function(name, cb) {
  Section.findOne({name: name}, cb)
}
