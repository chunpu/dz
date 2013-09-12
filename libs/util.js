var crypto = require('crypto')

exports.getShowtime = function(date) {
    var now = Date.now()
    var showtime
    if (now - date < 60 * 1000 * 60) {
      // less than 1 hour
      var minutes = ~~((now - date) / 1000 / 60)
      showtime = minutes + '分钟前'
    } else if (now - date < 24 * 60 * 60 * 1000) {
      var hours = ~~((now - date) / 1000 / 60 / 60)
      showtime = hours + '小时前'
    } else if (now - date < 4 * 24 * 60 * 60 * 1000) {
      var days = ~~((now - date) / 1000 / 60 / 60 / 24)
      showtime = days + '天前 ' + date.getHours() + ':' + date.getMinutes()
    } else {
      showtime = (date.getMonth()+1) + '月' + date.getDate() + '日 ' + date.getHours() + ':' + date.getMinutes()
    }
    return showtime
}

exports.getUserByPost = function(posts, cb) {
  var count = 0
  if (posts.length === 0) {
    cb(null, posts)
    return
  }
  posts.forEach(function(post) {
    var date = post.last_reply_at
    post.time = exports.getShowtime(date)
    model.User.get(post.author, function(err, user) {
      if (!err) {
        user = user || {}
        var email = user.email || '00000'
        user.avatar = 'http://www.gravatar.com/avatar/' + exports.md5(email) + '?s=42'
        post.user = user
        count++
        if (count === posts.length) {
          cb()
        }
      } else {
        cb(err)
      }
    })
  })
}

exports.md5 = function(str) {
  var crypto = require('crypto')
  var md5sum = crypto.createHash('md5')
  md5sum.update(str)
  str = md5sum.digest('hex')
  return str
}

exports.encrypt = function(str, secret) {
  var cipher = crypto.createCipher('aes192', secret)
  var enc = cipher.update(str, 'utf8', 'hex')
  enc += cipher.final('hex')
  return enc
}

exports.decrypt = function(str, secret) {
  var decipher = crypto.createDecipher('aes192', secret)
  var dec = decipher.update(str, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}

exports.genToken = function(user, res) {
  var secret = user.secret || 'secret'
  var str = [user._id, user.name, user.passwd, secret].join('\t')
  var auth = exports.encrypt(str, 'secret')
  res.cookie('auth', auth, {path: '/', maxAge: 1000*60*60*24*30})
}

var model = require('../models')
exports.parseToken = function(auth, req, res, cb) {
  var str = exports.decrypt(auth, 'secret')
  var arr = str.split('\t')
  model.User.get(arr[0], function(err, user) {
    if (arr[1] === user.name) { // no need passwd
      // oh! it's async
      res.locals.user = user
      cb && cb()
    }
  })
}
