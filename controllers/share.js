var url = require('url')
var share_config = require('../libs/share').config
var model = require('../models')

exports.share = function(req, res, next) {
  var share_url = req.query.url
  var _url = share_url
  if (share_url && res.locals.user) {
    share_url = url.parse(share_url)
    share_url.src = _url
    if (share_url.hostname && share_config[share_url.hostname]) {
      share_url.selector = share_config[share_url.hostname].selector
    }
    if (share_url.selector) {
      // i know this website
      getContent(share_url, function(err, page) {
        page.url = share_url
        res.render('share/new', {page: page})
      })
    }
  } else {
    next()
  }
}

exports.new_post = function(req, res, next) {
  var share_url = req.query.url
  model.Post.add({
    type: 'share',
    author: res.locals.user._id,
    author_name: res.locals.user.name,
    title: req.body.title,
    content: req.body.content,
    share_url: share_url,
    share_preview: req.body.share_preview
  }, function(err, post) {
    if (post) {
      res.redirect('/post/'+post._id)
    } else {
      next()
    }
  })
}

function getContent(opt, cb) {
  var cheerio = require('cheerio')
  request(opt, function(err, html) {
    var $ = cheerio.load(html)
    var page = {}
    page.title = $('title').text()
    page.content = $(opt.selector).html()
    page.preview = $(opt.selector).text().substr(0, 100)
    cb(null, page)
  })
}

function request(opt, cb) {
  var http = require('http')
  var html = ''
  http.get('http://'+opt.hostname+opt.pathname, function(res) {
    res.on('data', function(d) {
      html += d
    })
    res.on('end', function() {
      cb(null, html)
    })
  }).on('error', function(err) {
    cb(err)
  })
}
