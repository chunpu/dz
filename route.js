var p = './controllers/'
var post = require(p+'post')
var sign = require(p+'sign')
var user = require(p+'user')
var section = require(p+'section')
var share = require(p+'share')

module.exports = function(app) {
  // post
  app.get('/', post.index)
  app.get('/new', post.new)

  app.post('/new', post.new_post)


  app.get('/post/:id', post.one)

  // sign
  app.get('/signup', sign.signup)
  app.post('/signup', sign.signup_post)
  app.get('/signout', sign.signout)
  app.get('/signin', sign.signin)
  app.post('/signin', sign.signin_post)

  // user
  app.get('/user/:id', user.one)

  app.get('/section', section.list)
  app.get('/section/:id', section.one)
  app.post('/section', section.new)

  app.get('/share', share.share)
  app.post('/share', share.new_post)
}
