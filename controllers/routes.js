require('dotenv').config()
var express = require('express')
var router = express.Router()
var path = require('path')
var db = require('../models')

var search = require('youtube-search')
var opts = {
  maxResults: 1,
  key: process.env.YT_KEY,
  type: 'video'
}
// var videoID

router.put('/song/upvote/:id', function (req, res) {
  // console.log('ping')
  db.Playlist.findById(req.params.id).then(function (vote) {
    return vote.increment('votes', { by: 1 })
  }).then(function (vote) {
    vote.reload()
    res.send(200)
  })
})

router.put('/song/downvote/:id', function (req, res) {
  // console.log('ping')
  db.Playlist.findById(req.params.id).then(function (vote) {
    return vote.decrement('votes', { by: 1 })
  }).then(function (vote) {
    vote.reload()
    res.send(200)
  })
})

// this route gets a song from the user and sends it to the db
router.post('/song/create', (req, res) => {
  console.log(req.body)

  // search for the song name submitted on front end
  search(req.body.songName, opts, function (err, results) {
    if (err) return console.log(err)

    // create the playlist
    db.Playlist.create({
      song_name: results[0].title,
      video_link: results[0].link,
      video_id: results[0].id,
      thumbnail_url: results[0].thumbnails.default.url,
      large_thumbnail_url: results[0].thumbnails.medium.url,
      votes: 0
    }).then(function (data) {
      db.Playlist.findAll({}).then(function (r) {
        res.json(r)
      })
    })
      .catch(function (err) {
        console.log(err)
      })
    // videoID = results[0].id
    // console.dir(results[0].id)
    // console.dir(results[0].link)
    // console.dir(results[0].thumbnails.default.url)

    // console.log(videoID)
  })
})

router.get('/all/videos', function (req, res) {
  db.Playlist.findAll({}).then(function (r) {
    res.json(r)
  })
})

router.get('/next/videos', function (req, res) {
  db.Playlist.findAll({
    order: [['votes', 'DESC']]
  }).then(function (r) {
    res.json(r)
  })
})

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/index.html'))
})

router.post('/vote/create', (req, res) => {
  console.log(req.body)
})

// router.post('/admin/create', (req, res) => {
//   db.Admin.create({name: 'admin', password: 'password'}).then(function (data) {
//     db.Admin.findAll({}).then(function(r){
//       res.json(r)
//     })
//   })
//   console.log(req.body)
// })
  
//admin credentials
router.get('/admin/creds', function (req, res) {
  db.Admin.findAll({}).then(function (r) {
    console.log(r)
    res.json(r)
  })
})

//delete songs
router.delete('/song/:id', (req, res) => {
  console.log('delete route console log :' + req.params.id)
  db.Playlist.destroy({
    where: {
      id: req.params.id
    }
  }).then(function () {
    res.send(req.body.data)
  })
})


module.exports = router
  