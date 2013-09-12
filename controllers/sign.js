var model = require('../models')
var util = require('../libs/util')

exports.signout = function(req, res) {
  var referer = req.headers.referer || '/'
  res.clearCookie('auth')
  res.locals.alert = '退出登录'
  res.redirect(referer)
}

exports.signup = function(req, res) {
  var referer = req.headers.referer || '/'
  res.render('sign/signup', {referer: referer})
}

exports.signin = function(req, res) {
  var referer = req.headers.referer || '/'
  res.render('sign/signin', {referer: referer})
}

exports.signin_post = function(req, res) {
  var name = req.body.name
  var passwd = util.md5(req.body.passwd)
  model.User.getByName(name, function(err, user) {
    if (err) {
      res.end(err)
    }
    if (user) {
      if (user.passwd === passwd) {
        // check pass
        util.genToken(user, res)
        var referer = req.body.referer || '/'
        res.locals.alert = '登陆成功！'
        res.redirect(referer)
      }
    } else {
      res.end('no this user')
    }
  })
}

exports.signup_post = function(req, res) {
  var name = req.body.name
  var passwd = util.md5(req.body.passwd)
  var email = req.body.email || ('@null'+name)
  model.User.add({
    name: name,
    passwd: passwd,
    email: email
  }, function(err, user) {
    if (err) {
      res.end('err')
    }
    util.genToken(user, res) // add cookie
    var referer = req.body.referer || '/'
    res.locals.alert = '注册成功！'
    res.redirect(referer)
  })
}
