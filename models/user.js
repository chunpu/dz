var mongoose = require('mongoose')
var util = require('../libs/util')

var UserSchema = new mongoose.Schema({
  name: {type: String, index: true, unique: true}, // user namea
  passwd: String, // password
  email: {type: String, unique: true}, // email address
  url: String, // may have homepage
  signature: String, // my signature
  
  score: {type: Number, default: 0}, // jinyan
  power: {type: Number, default: 0}, // power
  post_count: {type: Number, default: 0}, // how many post
  create_at: {type: Date, default: Date.now}, // when create
  update_at: {type: Date, default: Date.now} // last post
})

var Users = mongoose.model('users', UserSchema) // of cource it will be smallcase and append a s, this is not constructor

exports.getRecentPosts = function(id, cb) {
  var opt = {
    filter: {author: id},
    sort: {create_at: -1}
  }
  var Post = require('./post')
  Post.getPage(opt, cb)
}

exports.find = function(opt, cb) {
  Users.find(opt, cb)
}

exports.removeById = function(id, cb) {
  Users.findByIdAndRemove(id, cb)
}

/**
 * add user
 *
 * user params json
 * callback
 */
exports.add = function(user, cb) {
  var _user = new Users(user)
  _user.save(cb)
}

/**
 * get user by id
 *
 * id
 * callback
 */
exports.get = function(id, cb) {
  Users.findOne({_id: id}, function(err, user) {
    if (user) {
      user.create_at_showtime = util.getShowtime(user.create_at)
      var email = user.email || '00000'
      user.avatar = 'http://www.gravatar.com/avatar/' + util.md5(user.email) + '?s=42'
      cb(null, user)
    } else {
      cb(err)
    }
  })
}

exports.getByName = function(name, cb) {
  Users.findOne({name: name}, cb)
}
