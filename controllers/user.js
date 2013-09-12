var model = require('../models')

exports.one = function(req, res) {
  var id = req.params.id
  model.User.get(id, function(err, user) {
    res.locals.person = user
    model.User.getRecentPosts(id, function(err, posts) {
      posts = posts || []
      posts.forEach(function(post) {
        post.user = user
      })
      res.locals.posts = posts
      res.render('user/one')
    })
  })
}
