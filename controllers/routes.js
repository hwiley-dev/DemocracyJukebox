var express = require('express')
var router = express.Router()
var search = require('youtube-search')
var opts = {
  maxResults: 1,
  key: 'AIzaSyBJV-QAc3rs1A8tfuyr4ZqKxypDqkqJLYg',
  type: 'video'
}

// this route gets a song from the user and sends it to the db
router.post('/song/create', (req, res) => {
  console.log(req.body)
  search(req.body.songName, opts, function (err, results) {
    if (err) return console.log(err)
  
    console.dir(results[0].link)
  })

})


module.exports = router
