// npm packages
var express = require('express')
var bodyparser = require('body-parser')
var path = require('path')
var router = require('./controllers/routes')
var db = require('./models')

// new express app
var app = express()
var PORT = process.env.PORT || 3000


// middleware
app.use(express.static(path.join(__dirname, 'public/views')))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use('/', router)

// your code here...
db.sequelize.sync({ force: true}).then(function() {
  // listening port
  app.listen(PORT, function (e) {
    if (e) throw e
  })
})




  // console.dir(results[0].link)
  var videoID = results[0].id
  return videoID



console.log(videoID)
