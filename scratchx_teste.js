/*
 *This program is free software: you can redistribute it and/or modify
 *it under the terms of the GNU General Public License as published by
 *the Free Software Foundation, either version 3 of the License, or
 *(at your option) any later version.
 *
 *This program is distributed in the hope that it will be useful,
 *but WITHOUT ANY WARRANTY; without even the implied warranty of
 *MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *GNU General Public License for more details.
 *
 *You should have received a copy of the GNU General Public License
 *along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
(function(ext) {
  
    ext.teste_get = function(pin, callback) {
    $.ajax({
      method: "GET",
      url: "https://api.thingspeak.com/channels/219279/feeds.json",
      dataType: "json",
      success: function(data) {
        console.log(data.feeds[data.feeds.length-1].field1);
        if (data.feeds.length > 0) {
          callback(data.feeds[data.feeds.length-1][pin]);
          return;
        }
        callback("Ocorreu um erro");
      },
      error: function(xhr, textStatus, error) {
        console.log(error);
        callback();
      }
    });
  };

  
  ext.teste_post = function() {
      $.post( "https://api.thingspeak.com/update.json?api_key=4QS8PYAXTT6TXQDC&field1=ON", function( data ) {
  $( ".result" ).html( data );
});
    
  };


  

  ext.latestUserTweet = function(name, callback) {
    $.ajax({
      method: "GET",
      url: "http://scratchx-twitter.herokuapp.com/1.1/statuses/user_timeline.json",
      data: {
        screen_name: name,
        count: 1
      },
      dataType: "json",
      success: function(data) {
        if (data.length > 0) {
          callback(data[0].text);
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
      ['R', 'Valor de %m.pins', 'teste_get', 'field1'],
      ['R', 'ligar', 'teste_post'],
      ['R', 'latest tweet from @%s', 'latestUserTweet', 'scratch'],
      ['R', 'most %m.sort tweet containing %s', 'getTopTweet', 'recent', '#scratch'],
    ],
    menus: {
      sort: ["popular", "recent"],
      pins: ["field1", "field2"]
      
      
    },
    url: 'https://dev.twitter.com/overview/documentation'
  };

  ScratchExtensions.register('Twitter', descriptor, ext);

})({});
