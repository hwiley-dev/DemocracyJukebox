 
var $ = window.$
let voteCount = 3

/*
  * @desc Once doc finishes load, display voteCount and update song list
*/
$(document).ready(function () {
  updateList()
  displayVoteCount()
})

/*
  * @desc handles user submission of song name search and passes to routes.js
  * TODO: add more precise search control & handle for 
*/
$('#sbmt').on('click', () => {
  event.preventDefault()
  var songName = $('#songName').val()
  var data = {
    songName: songName
  }
  $('#songName').val('')

  // Pass in POST response to getTable() and getVideos()
  $.post('/song/create', data).then(function (r) {
    console.log(r)
    console.log('ping')
    getTable(r)
    getVideos(r)
  })
})

/* 
  @desc prints out the number of votes left to the user

*/
function displayVoteCount() {
  $('.voteCountDiv').html('Votes Left : '+ voteCount)
}

/*
  * @desc AJAX GET
*/
function getSongs () {
  $.get('/all/videos').then(function (r) {
    var songs = r
    getTable(songs)
    
  })
    .catch(function (err) { 
      console.log(err)
    })
}

getSongs()



function getTable (songs) {
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
    <td><button class="deleteBtn btn btn-danger" + data-value="` + songs[i].id + `">Delete</button></td>
    </tr>`
    )
    // Hide delete buttons until admin logs in using jQuery hide() method
    $(".deleteBtn").hide()
  }
}

/* 
  * @desc AJAX PUT request 
      * handles upvote
      * subtracts remaining user votes
      * updates list
*/
$(document).on('click', '#upvote', function () {
  var voteID = $(this).attr('data-value')
  if (voteCount === 0) { alert('You are out of Votes! Please wait until the song is finished.') } 
  else {
    $.ajax({
      url: '/song/upvote/' + voteID,
      type: 'PUT',
      success: function (somethin) {
        getSongs()
        updateList()
        console.log('this log is ' + somethin)
      }
    })
    voteCount--
    displayVoteCount()
  }
})

/* 
  * @desc AJAX PUT request 
      * handles downvote
      * subtracts remaining user votes
      * updates list
*/
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

// Loads the IFrame Player API code asynchronously.
var tag = document.createElement('script')

tag.src = 'https://www.youtube.com/iframe_api'
var firstScriptTag = document.getElementsByTagName('script')[0]
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

/*
  * @desc Builds iframe player once API is run
*/
var player
function onYouTubeIframeAPIReady () {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: '76O3w4pt0CA',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  })
}

// Create the index chosen from the video array
var index = -1

// 4. The API will call this function when the video player is ready.

function onPlayerReady (event) {
  event.target.playVideo()
}
//    The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
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
      <td><button class="deleteBtn btn btn-danger" data-value="` + songs[i].id + `">Delete</button></td>
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

// Admin login
$('#admin').on('click', () => {
  event.preventDefault()
  var nameFront = $("#name").val()
  var pwFront = $("#pw").val()
  console.log(name)
  console.log(pw)
  $.get('/admin/creds').then(function(r){
    var keys = r // GET response from admin login inputs
    console.log(keys[0].name)
    var nameBack = keys[0].name
    console.log(keys[0].password)
    var pwBack = keys[0].password
    if(nameFront === nameBack && pwFront === pwBack){

      // Show delete buttons once admin logs in using jQuery show() method
      $(".deleteBtn").show()
      $(".deleteBtn").on("click", function(){
        // On click of delete button, remove selected song from db
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
