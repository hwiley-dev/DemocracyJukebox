require('dotenv').config()
var express = require('express')
var router = express.Router()
var path = require("path");
var db = require('../models')

var search = require('youtube-search')
var opts = {
  maxResults: 1,
  key: process.env.YT_KEY,
  type: 'video'
}
var videoID
// this route gets a song from the user and sends it to the db
router.post('/song/create', (req, res) => {
  console.log(req.body)

  // search for the song name submitted on front end
  search(req.body.songName, opts, function (err, results) {
    if (err) return console.log(err)
    //create the playlist
    db.Playlist.create({
      song_name: results[0].title,
      video_link: results[0].link,
      video_id: results[0].id,
      thumbnail_url: results[0].thumbnails.default.url
    })
    videoID = results[0].id
    console.dir(results[0].id)
    console.dir(results[0].link)
    console.log(results)
    console.dir(results[0].thumbnails.default.url)
  })
  res.send(200)
})

router.get('/all/videos', function (req, res) {
  console.log('ping')
  db.Playlist.findAll({}).then(function (r) {
    res.json(r)
  })
})

router.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, "../public/views/"))
})

router.post('/vote/create', (req, res) => {
  console.log(req.body)
})

// router.get('/song', (req, res) => {
//   //returning data from database
//   res.send(videoID)

// })



module.exports = router
