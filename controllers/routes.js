var express = require('express')
var router = express.Router()

// this route gets a song from the user and sends it to the db
router.post('/song/create', (req, res) => {
  console.log(req.body)
})

module.exports = router
