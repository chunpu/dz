var express = require('express')
var app = express()
var locals = require('./locals')

// template engine set
// app.set('view engine', 'html') // so can use just index rather than index.html
//app.set('views', __dirname + '/views') // add __dirname
// app.engine('html', require('ejs').__express) // use noob ejs

app.engine('jade', require('jade').__express)
app.set('view engine', 'jade')
locals(app)
/*
app.use(function(req, res) {
  res.render('index')
})
*/
var model = require('./models')
var route = require('./route')
/*
model.Section.add({
  name: '测试板块2',
  discription: '这是测试2啦!'
},console.log)
*/
app.use(express.cookieParser())
app.use(express.bodyParser())
app.use(function(req, res, next) {
  res.locals.req_path = req.path // for signin refer
  var auth = req.cookies.auth
  res.locals.referer = req.headers.referer || '/'
  if (auth) {
    
    var util = require('./libs/util')
    util.parseToken(auth, req, res, next)
    return
  }
  next()
})
route(app)

/*
model.Post.add({
  title: 'post4',
  content: 'my content4'
}, console.log)

/*
model.User.getByName('user2', function(err, doc) {
  console.log(doc)
})
/*
model.User.add({
  name: 'user2',
  passwd: 'passwd',
  email: 'xxx'
}, console.log)
*/
app.listen(70)
