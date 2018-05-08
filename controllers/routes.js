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

router.put('/song/upvote/:id', function(req, res) {
  console.log(req.params.id)
  // db.Playlist.update({
  //   where: {
  //     id: null
  //   }
  // });
})

router.put('/song/downvote/:id', function(req, res) {
  console.log(req.params.id)
  // db.Playlist.update({
  //   where: {
  //     id: null
  //   }
  // });
})

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
      thumbnail_url: results[0].thumbnails.default.url,
      votes: 0
    }).then(function(data){
      db.Playlist.findAll({}).then(function (r) {
        res.json(r)
      })
    })
    .catch(function(err){
      console.log(err);
    })
    // videoID = results[0].id
    // console.dir(results[0].id)
    // console.dir(results[0].link)
    // console.dir(results[0].thumbnails.default.url)

    // console.log(videoID)
  })
  
})

//added by Qdwag
router.get('/all/videos', function (req, res) {
  console.log('ping')
  db.Playlist.findAll({}).then(function (r) {
    res.json(r)
  })
})

router.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, "../public/views/index.html"))
})

router.post('/vote/create', (req, res) => {
  console.log(req.body)
})

module.exports = router
