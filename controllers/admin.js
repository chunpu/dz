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

var post = exports.post = {}

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
