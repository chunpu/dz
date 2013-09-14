module.exports = function(app) {

  app.locals.pretty = true
  app.locals.config = require('./config').config
  
  app.locals.basedir = __dirname + '/views' // can use extends /layout now

  var model = require('./models')
  var util = require('./libs/util')
  app.locals.getShowtime = util.getShowtime

  function timer() {
    // it's ugly
    refreshHotPosts()
    correctSectionCount()
  }

  setInterval(timer, 1000)

  model.Section.getByName('未分组', function(err, section) {
    if (section) {
      app.locals.no_section = section
    }
  })

  function refreshHotPosts() {
    model.Post.getPage({
      posts_per_page: 5,
      sort: {
        'reply_count': 1
      }
    }, function(err, posts) {
      if (posts) {
        app.locals.hot_posts = posts
      }
    })
  }

  function correctSectionCount() {
    var sectionHash = {}
    app.locals.sectionHash = sectionHash
    model.Section.list(function(err, sections) {
      if (sections) {
        app.locals.sections = sections
        sections.forEach(function(section) {
          sectionHash[section._id] = section.name
          model.Post.find({section: section.id}, function(err, posts) {
            if (posts) {
              section.post_count = posts.length
            }
          }) 
        })
      }
    })
  }
  
}



