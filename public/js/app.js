
$(document).ready(function() {
  $('#sbmt').on('click', () => {
    event.preventDefault()
    var songName = $('#songName').val()
    console.log(songName)
    $.ajax({
      method: 'POST',
      // dataType: 'json',
      url: 'song/create',
      data: {songName: songName}
    })
  })
  
  
        // 2. This code loads the IFrame Player API code asynchronously.
        var tag = document.createElement('script');
  
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
        // 3. This function creates an <iframe> (and YouTube player)
        //    after the API code downloads.
        var player;
        function onYouTubeIframeAPIReady() {
          player = new YT.Player('player', {
            height: '390',
            width: '640',
            videoId: 'M7lc1UVf-VE',
            events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange
            }
          });
        }
  
        // 4. The API will call this function when the video player is ready.
        function onPlayerReady(event) {
          event.target.playVideo();
        }
  
        // 5. The API calls this function when the player's state changes.
        //    The function indicates that when playing a video (state=1),
        //    the player should play for six seconds and then stop.
        var done = false;
        function onPlayerStateChange(event) {
          if (event.data == YT.PlayerState.PLAYING && !done) {
            setTimeout(stopVideo, 6000);
            done = true;
          }
        }
        function stopVideo() {
          player.stopVideo();
        }  

$(function () {
  $('form').on('submit', function (e) {
    e.preventDefault()
    // prepare request
    var request = gapi.client.youtube.search.list({
      part: 'snippet',
      // below we can choose type: video || channel || playlist
      type: 'video',
      q: encodeURIComponent($('#search').val()).replace(/%20/g, '+'),
      maxResults: 10,
      order: 'viewCount'

    })
    // Execute Request

    request.execute(function(response){
      var results = response.results;
      $.each(results.items, function(index, item) {
        //below is get params for youtube api with an append to the front div while passing through data
        $.get("tpl/item.html", function(data) {
          $("#results").append(data);
        
        });
        console.log(results)
        console.log(response)
      });
    });
  });
});


function init () {
  gapi.client.setApiKey('AIzaSyAzHZIl1ZJ639hzfiQEJgW2ZdxqfrCCKQ0')
  gapi.client.load('youtube', 'v3', function () {

  })
}

$('#sbmt').on('click', () => {
  event.preventDefault()
  var songName = $('#songName').val()
  console.log(songName)
})
