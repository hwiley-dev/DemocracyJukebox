// npm packages
var express = require('express')
var bodyparser = require('body-parser')
var path = require('path')

// new express app
var app = express()

// middleware
app.use(express.static(path.join(__dirname, 'public/views')))
app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json())

// your code here...
var userArr = []

app.get('/getContact', function (req, res) {
  res.json(userArr)
})

app.get('/contact', function (req, res){
  res.redirect('contact.html')
})

var PORT = process.env.PORT || 3000
// listening port
app.listen(PORT, function (e) {
  if (e) throw e
})
