var util = require('../libs/util')
var model = require('../models')

exports.check = function(req, res, next) {
  if (res.locals.user && res.locals.user.isAdmin) {
    next()
  } else {
    res.end('no power')
  }
}

exports.index = function(req, res) {
  res.render('admin/index')
}

var user = exports.user = {}

user.index = function(req, res) {
  model.User.find({}, function(err, users) {
    if (users) {
      res.locals.users = users
      res.render('admin/user')
    }
  })
}

user.delete = function(req, res) {
  var users = req.body.users || []
  var count = 0
  users.forEach(function(user_id) {
    model.User.removeById(user_id, function(err) {
      count++
      if (count === users.length) {
        res.end('ok')
      }
    })
  })
}

var post = exports.post = {}

post.delete = function(req, res) {
  var posts = req.body.posts || []
  var count = 0
  posts.forEach(function(post_id) {
    model.Post.removeById(post_id, function(err) {
      count++
      if (count === posts.length) {
        res.end('ok')
      }
    })
  })
}

post.index = function(req, res) {
  model.Post.getPage({
    posts_per_page: 100
  }, function(err, posts) {
    res.locals.posts = posts
    res.render('admin/post')
  })
  /*
  model.Post.find(function(err, posts) {
    if (posts) {
      res.locals.posts = posts
      res.render('admin/post')
    }
  })
  */
}

var section = exports.section = {}

section.index = function(req, res) {
  res.render('admin/section')
}

section.delete = function(req, res) {
  var passwd = util.md5(req.body.passwd)
  var section_id = req.params.id
  if (passwd === res.locals.user.passwd) {
    model.Section.get(section_id, function(err, section) {
      if (section) {
        section.remove(function(err) {
          if (!err) {
            res.end('ok')
          }
        })
      }
    })
  } else {
    res.end('wrong')
  }
}
