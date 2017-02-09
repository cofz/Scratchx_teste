
(function(ext) {

  ext.latestUserTweet = function() {
  $.get( "https://thingspeak.com/channels/219279/field/1/last.html", function( data ) {
});    
    
  };

  ext.getTopTweet = function(sort, str, callback) {
    //If searching popluar, remove # and @ symbols from query
    if (sort == "popular") {
      str = str.replace('#','').replace('@','');
    }
    $.ajax({
      method: "GET",
      url: "http://scratchx-twitter.herokuapp.com/1.1/search/tweets.json",
      data: {
        q: encodeURIComponent(str),
        result_type: sort,
        count: 1
      },
      dataType: "json",
      success: function(data) {
        if (data.statuses.length > 0) {
          callback(data.statuses[0].text);
          return;
        }
        callback("No tweets found");
      },
      error: function(xhr, textStatus, error) {
        console.log(error);
        callback();
      }
    });
  };

  ext._getStatus = function() {
    return { status:2, msg:'Ready' };
  };

  var descriptor = {
    blocks: [
      ['R', 'latest tweet from @%s', 'latestUserTweet', 'scratch'],
      ['R', 'most %m.sort tweet containing %s', 'getTopTweet', 'recent', '#scratch'],
    ],
    menus: {
      sort: ["popular", "recent"]
    },
    url: 'https://dev.twitter.com/overview/documentation'
  };

  ScratchExtensions.register('Teste', descriptor, ext);

})({});
