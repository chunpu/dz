var p = './controllers/'
var post = require(p+'post')
var sign = require(p+'sign')
var user = require(p+'user')
var section = require(p+'section')
var share = require(p+'share')
var admin = require(p+'admin')

module.exports = function(app) {

  // admin
  app.get('/admin*', admin.check) // check adn next
  app.get('/admin', admin.index)
  app.get('/admin/section', admin.section.index)
  app.post('/admin/section/:id/delete', admin.section.delete)
  app.get('/admin/post', admin.post.index)
  app.post('/admin/post/delete', admin.post.delete)
  app.get('/admin/user', admin.user.index)
  app.post('/admin/user/delete', admin.user.delete)

  // post
  app.get('/', post.index)
  app.get('/new', post.new)
  app.post('/new', post.new_post)
  app.get('/post/:id', post.one)
  app.post('/post/:id/reply', post.reply)
  app.post('/post/:id', post.edit)

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
