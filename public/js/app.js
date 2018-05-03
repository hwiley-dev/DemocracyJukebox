$(function(){
  $('form').on('submit', function (e) {
    e.preventDefault();
    //prepare request
    var request = gapi.client.youtube.search.list({
      part: 'snippet',
      // below we can choose type: video || channel || playlist
      type: 'video',
      q: encodeURIComponent($('#search').val()).replace(/%20/g, "+"),
      maxResults: 10,
      order: 'viewCount',

    });
    // Execute Request
    request.execute(function(response){
      var results = response.results;
      $.each(results.items, function(index, item) {
        //below is get params for youtube api with an append to the front div while passing through data
        $.get("tpl/item.html", function(data) {
          $("#results").append(data);
        
        });
      });
    });
  });
      console.log
});

function init() {
  gapi.client.setApiKey('AIzaSyAzHZIl1ZJ639hzfiQEJgW2ZdxqfrCCKQ0');
  gapi.client.load('youtube', 'v3', function () {

  });
}

$('#sbmt').on('click', () => {
  event.preventDefault()
  var songName = $('#songName').val()
  console.log(songName)
})

