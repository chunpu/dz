var model = require('../models')
var util = require('../libs/util')

exports.new = function(req, res) {
  var name = req.body.name
  var description = req.body.description
  if (res.locals.user && res.locals.user._id) {
    var uid = res.locals.user._id
  }
  model.Section.add({
    name: name,
    description: description,
    create_by: uid
  }, function(err, section) {
    if (section) {
      res.redirect('/section')
    }
  })
}

exports.list = function(req, res) {
  res.render('section/list')
}

exports.one = function(req, res, next) {
  var id = req.params.id
  if (id === '未分组') {
    model.Post.find({section: undefined}, function(err, posts) {
         util.getUserByPost(posts, function() {
          res.locals.posts = posts
          res.render('section/one')
          return
        })
     
    })

  } else {

    model.Section.get(id, function(err, section) {
      if (section) {
        // section got
        section.visit_count++
        section.save()
        res.locals.section = section
        model.Post.getPage({
          filter: {section: id},
          sort: {
            'create_at': -1
          }
        }, function(err, posts) {
          //res.render('section/one', {posts: posts})
          // post.user = user
          util.getUserByPost(posts, function() {
            res.locals.posts = posts
            res.render('section/one')
          })
        })
      } else {
        next()
      }
    })
  }
}


