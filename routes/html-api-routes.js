module.exports = function (app) {
  app.get('/otherPage', (req, res) => {
    res.redirect('something.html')
  })
  app.post('/song/create', (req, res) => {
    console.log(req.body)
  })
}
