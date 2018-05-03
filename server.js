// npm packages
var express = require('express')
var bodyparser = require('body-parser')
var path = require('path')
var htmlApiRoutes = require('./routes/html-api-routes')
// new express app
var app = express()

// middleware
app.use(express.static(path.join(__dirname, 'public/views')))
app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json())

// your code here...
var userArr = []

htmlApiRoutes(app)

var PORT = process.env.PORT || 3000
// listening port
app.listen(PORT, function (e) {
  if (e) throw e
})

var search = require('youtube-search')

var opts = {
  maxResults: 1,
  key: 'AIzaSyBJV-QAc3rs1A8tfuyr4ZqKxypDqkqJLYg',
  type: 'video'
}

var searchTerm = 69
search(searchTerm, opts, function (err, results) {
  if (err) return console.log(err)

  console.dir(results[0].link)
})
