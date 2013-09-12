var mongoose = require('mongoose')
var Id = mongoose.Schema.ObjectId
var util = require('../libs/util')

var PostSchema = new mongoose.Schema({
  title: String, // for search
  content: String,
  author: Id,
  score: {type: String, default: 0}, // can do sth like top

  visit_count: {type: Number, default: 0},
  reply_count: {type: Number, default: 0},
  collect_count: {type: Number, default: 0},

  create_at: {type: Date, default: Date.now},
  update_at: {type: Date, default: Date.now},
  last_reply_at: {type: Date, default: Date.now}, // sort by last reply

  type: String, // maybe share and is noescape

  // share
  share_url: String, // like www.ifaner.com/foo
  share_preview: String, // get as text() by default 100 words

  section: Id,
  tags: Array,
  
  last_reply: Id // get id so we can show who reply this
})

var Post = mongoose.model('posts', PostSchema)


exports.add = function(post, cb) {
  var _post = new Post(post)
  _post.save(cb)
}

exports.find = function(opt, cb) {
  Post.find(opt, cb)
}

exports.list = function(num, cb) {
  Post.find().sort({_id: -1}).limit(num).exec(cb)
}

exports.get = function(id, cb) {
  Post.findOne({_id: id}, function(err, post) {
    if (post) {
      var User = require('./user')
      User.get(post.author, function(err, user) {
        if (user) {
          post.user = user
          cb(null, post)
        }
      })
    } else {
      cb(err)
    }
  })
}

/**
 * get a collections of posts
 *
 * opt
 * callback
 * 
 * opt.page
 * opt.posts_per_page => how many posts per page,default 20
 * opt.last_id => last post id, it can be with page together
 * opt.sortBy => create_at | last_reply_at | update_at | visit_count | reply_count | collect_count
 */
exports.getPage = function(opt, cb) {
  var posts_per_page = opt.posts_per_page || 20
  if (opt.last_id) {
    // callback posts by last_id rather than page
    Post.find({_id: {$gt: last_id}}).limit(posts_per_page).exec(cb)
  } else {
    // sort by page
    // var sortBy = opt.sortBy || 'create_at' // it is wrong
    var sort = opt.sort || {'last_reply_at': -1} 
    var page = opt.page || 0
    var start = page * posts_per_page
    //  will it eats most cpu and memory
    var filter = opt.filter || {}
    // Post.find(filter).sort({sortBy: -1}).skip(start).limit(posts_per_page).exec(cb)
    Post.find(filter).sort(sort).skip(start).limit(posts_per_page).exec(function(err, posts) {
      if (posts) {
        util.getUserByPost(posts, function() {
          cb(null, posts)
        })
      }
    })
  }
}
