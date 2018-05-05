require('dotenv').config()
var express = require('express')
var router = express.Router()
var db = require('../models')

var search = require('youtube-search')
var opts = {
  maxResults: 1,
  key: process.env.YT_KEY,
  type: 'video'
}

// this route gets a song from the user and sends it to the db
router.post('/song/create', (req, res) => {
  console.log(req.body)

  // search for the song name submitted on front end
  search(req.body.songName, opts, function (err, results) {
    if (err) return console.log(err)
    db.Playlist.create({
      song_name: results[0].title,
      video_link: results[0].link
    })
    console.dir(results[0].link)
    console.log(results)
  })
})

router.post('/vote/create', (req, res) => {
  console.log(req.body)
})

module.exports = router
