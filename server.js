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
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use('/', router)

// your code here...
var force = { force: true };
db.sequelize.sync(force).then(function () {
  // listening port
  app.listen(PORT, function (e) {
    if (e) throw e
  })
})