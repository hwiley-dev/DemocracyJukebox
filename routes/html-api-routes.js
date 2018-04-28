module.exports = function (app) {
    app.get("/otherPage", function (req, res) {
        res.redirect('something.html')
    })
}