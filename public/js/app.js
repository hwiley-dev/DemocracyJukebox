var $ = window.$
let voteCount = 3

$(document).ready(function () {
  updateList()
  //initially display the vote count to the user
  displayVoteCount()
})

//handles user submission of song name search and passes to routes.js
$('#sbmt').on('click', () => {
  event.preventDefault()
  var songName = $('#songName').val()
  var data = {
    songName: songName
  }
  $('#songName').val('')

  $.post('/song/create', data).then(function (r) {
    console.log(r)
    console.log('ping')
    getTable(r)

    getVideos(r)
  })
})

//prints out the number of votes left to the user
function displayVoteCount() {
  $('.voteCountDiv').html('Votes Left : '+ voteCount)
}

function getSongs () {
  $.get('/all/videos').then(function (r) {
    var songs = r
    getTable(songs)
    // console.log(r)
  })
    .catch(function (err) {
      console.log(err)
    })
}

getSongs()

function getTable (songs) {
  // console.log(songs)
  $('#songs').empty()

  function getVideos () {
    $.get('/all/videos').then(function (r) {
      for (var i = 0; i < r.length; i++) {
        console.log(r[i].video_id)
        var songID = r[i].video_id
        onYouTubeIframeAPIReady(songID)
      }
    })
  }

  for (i = 0; i < songs.length; i++) {
    var counter = i + 1
    $('#songs').append(`
    <tr>
    <th scope="row" class="align-middle">` + counter + `</th>
    <td><button  id="upvote" data-value="` + songs[i].id + `" class="upvoteBtn bothVotes"><i class="fas fa-arrow-up"></i></button><br> <span class="">` + songs[i].votes + `</span> <br><button id="downvote" data-value="` + songs[i].id + `" class="downvoteBtn bothVotes"><i class="fas fa-arrow-down"></i></button></td>
    <td><img src="` + songs[i].thumbnail_url + `"></td>
    <td class="text-left">` + songs[i].song_name + `</td>
    <td><button class="deleteBtn btn btn-danger" + data-value="` + songs[i].id + `">X</button></td>
    </tr>`
    )
    //hide delete buttons until admin logs in 
    $(".deleteBtn").hide()
  }
}

//handles user voting on each song in the tableList, the variable voteCount is declared globally in line 2
$(document).on('click', '#upvote', function () {
  var voteID = $(this).attr('data-value')
  if (voteCount === 0) { alert('You are out of Votes! Please wait until the song is finished.') } else {
    $.ajax({
      url: '/song/upvote/' + voteID,
      type: 'PUT',
      success: function (somethin) {
        getSongs()
        updateList()
        console.log(somethin)
      }
    })
    voteCount--
    displayVoteCount()
  }
})

$(document).on('click', '#downvote', function () {
  console.log('ping')
  var voteID = $(this).attr('data-value')
  if (voteCount === 0) { alert('you only get 3 votes') } else {
    $.ajax({
      url: '/song/downvote/' + voteID,
      type: 'PUT',
      success: function (data) {
        getSongs()
        updateList()
        console.log(data)
      }
    })
    voteCount--
    displayVoteCount()
  }
})

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script')

tag.src = 'https://www.youtube.com/iframe_api'
var firstScriptTag = document.getElementsByTagName('script')[0]
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player
function onYouTubeIframeAPIReady () {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'VYOjWnS4cMY',
    playerVars: {
      'controls': 0,
      'disablekb': 1,
      'iv_load_policy': 3,
      'modestbranding': 1,
      'rel': 0
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  })
}

// create the index chosen from the video array
var index = -1

// 4. The API will call this function when the video player is ready.

function onPlayerReady (event) {
  //event.target.playVideo()
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false
function onPlayerStateChange (event) {
  if (event.data === 0) {
    index++
    $.get('/next/videos').then(function (r) {
      console.log(r)
    })
      .catch(function (err) {
        console.log(err)
      })
    voteCount = 3
    displayVoteCount()
    playNewVideo() 
    nowPlaying() //updates to the user to display the song name and details of the song currently playing
  }
}

function updateList () {
  $.get('/next/videos').then(function (r) {
    // console.log(r)
    var songs = r

    $('#songs').empty()
    for (i = 0; i < songs.length; i++) {
      var counter = i + 1

      $('#songs').append(`
      <tr>
      <th scope="row" class="align-middle">` + counter + `</th>
      <td><button  id="upvote" data-value="` + songs[i].id + `" class="upvoteBtn"><i class="fas fa-arrow-up"></i></button><br> <span class="">` + songs[i].votes + `</span> <br><button id="downvote" data-value="` + songs[i].id + `" class="downvoteBtn"><i class="fas fa-arrow-down"></i></button></td>
      <td><img src="` + songs[i].thumbnail_url + `"></td>
      <td class="text-left">` + songs[i].song_name + `</td>
      <td><button class="deleteBtn btn btn-danger" data-value="` + songs[i].id + `">X</button></td>
      </tr>`
      )
      $(".deleteBtn").hide()
    }
  })
    .catch(function (err) {
      console.log(err)
    })
}

// next video has the most votes
function playNewVideo () {
  $.get('/next/videos').then(function (songs) {
    console.log(songs)
    console.log(songs[0].video_id)
    player.loadVideoById(songs[0].video_id)
    event.target.playVideo()
    playNewVideo(nextID)
  })
}

// removes the song with the most votes that is called to play next
function deletePlayingSong (id) {
  $.ajax({
    url: '/song/' + id,
    type: 'DELETE',
    success: function (result) {
      // Do something with the result
      console.log('This should be removed from the database' + result)
      voteCount = 3
      updateList()
    }
  })
}

// function to display the song name and details of the currently playing song in the youtube player iframe 
function nowPlaying () {
  $.get('/next/videos').then(function (r) {
    var songs = r
    console.log(r)
    deletePlayingSong(r[0].id)
    $('#nowPlayingTable').html(`
    <td><img src="` + songs[0].large_thumbnail_url + `"></td>
    <td>` + songs[0].song_name + `</td>`)
  })
}

function stopVideo () {
  player.stopVideo()
}

//admin login
$('#admin').on('click', () => {
  event.preventDefault()
  var nameFront = $("#name").val()
  var pwFront = $("#pw").val()
  console.log(name)
  console.log(pw)
  $.get('/admin/creds').then(function(r){
    var keys = r
    console.log(keys[0].name)
    var nameBack = keys[0].name
    console.log(keys[0].password)
    var pwBack = keys[0].password
    if(nameFront === nameBack && pwFront === pwBack){
      //show delete buttons once admin logs in
      $(".deleteBtn").show()
      $(".deleteBtn").on("click", function(){
        //upon click of delete button, remove selected song from db
        $.ajax({
          url: '/song/' + $(this).attr("data-value"),
          type: 'DELETE',
          success: function (result) {
            updateList()
          }
          
        })
      })

    }

  })
})

// Working on a scroll to top button
// $("#scrollUp").on('click', (function() {
//   $("html, body").animate({ scrollTop: 0 }, "slow");
//   return false;
// }))

