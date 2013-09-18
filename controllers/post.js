var model = require('../models')

exports.index = function(req, res) {
  /*
  model.Post.list(20, function(err, docs) {
    res.render('post/index', {posts: docs})
  })
  */
  var opt = {}
  model.Post.getPage(opt, function(err, posts) {
    res.render('post/index', {posts: posts})
  })
}

exports.edit = function(req, res) {
  var post_id = req.params.id
  model.Post.get(post_id, function(err, post) {
    if (post) {
      if (res.locals.user && post.author.toString() === res.locals.user._id.toString()) {
        console.log('pass')
        res.locals.post = post
        res.render('post/edit')
      }
    }
  })
}

exports.edit_post = function(req, res, next) {
  var post_id = req.params.id
  model.Post.get(post_id, function(err, post) {
    if (post) {
      post.title = req.body.title
      post.content = req.body.content
      post.save(function(err) {
        if (!err) {
          res.redirect('/post/'+post._id)
        } else {
          next()
        }
      })
    }
  })
}

exports.control = function(req, res, next) {
  var type = req.body.type
  var post_id = req.params.id
  model.Post.get(post_id, function(err, post) {
    if (post) {
      if (type === 'delete' && res.locals.user._id.toString() === post.author.toString()) {
        post.remove(function(err) {
          if (!err) {
            res.render('post/delete')
            return
          }
        })
      }
    } else {
      next()
    }
  })
}

exports.reply = function(req, res, next) {
  var content = req.body.reply
  var post_id = req.params.id
  model.Post.get(post_id, function(err, post) {
    if (post) {
      post.replys.unshift({
        author_id: res.locals.user._id,
        author_name: res.locals.user.name,
        content: content
      })
      post.save(function(err, post) {
        res.redirect('/post/'+post_id)
      })
    }
  })
}

exports.one = function(req, res, next) {
  // get /post/:id
  var id = req.params.id
  model.Post.get(id, function(err, post) {
    if (post) {
      res.locals.post = post
      model.Section.get(post.section, function(err, section) {
        if (section) {
          res.locals.section = section
        }
        res.render('post/one')
      })
    } else {
      next()
    }
  })
}

exports.new = function(req, res, next) {
  // sth is wrong,it's no use?
  var section_id = req.query.section || '未分组'
  model.Section.get(section_id, function(err, section) {
    if (section) {
      res.locals.section = section
    }
    res.render('post/new')
  })
}

exports.new_post = function(req, res, next) {
  // incr author post_count and section post_count
  model.Section.get(req.query.section, function(err, section) {
    section = section || {}
    model.Post.add({
      author: res.locals.user._id,
      author_name: res.locals.user.name,
      title: req.body.title,
      content: req.body.content,
      section: section._id
    }, function(err, post) {
      if (post) {
        incrAuthorPost(post.author)
        incrSectionPost(post.section)
        var id = post._id
        res.redirect('/post/'+id)
      } else {
        next()
      }
    })
   
  })

}

function incrAuthorPost(id) {
  model.User.get(id, function(err, user) {
    user.post_count++
    user.save()
  })
}

function incrSectionPost(id) {
  model.Section.get(id, function(err, section) {
    if (section) {
      section.post_count++
      section.save()
    }
  })
}
