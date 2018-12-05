$(function() {

    function loadData() {
        $.get("/api/games")
        .done(function(data) {
          $.getJSON( "/api/games", function( data ) {
            var items = [];
            $.each( data, function( key, val) {
                var player1 = val.gamePlayers[0].player.userName;

                if (val.gamePlayers[1] == null){
                    items.push( "<li id='listItem'>" + val.id + ". "+ val.created + ": " + player1+ "</li");
                }else {
                    items.push( "<li id='listItem'>" + val.id + ". "+ val.created + ": " + player1+ ", " + val.gamePlayers[1].player.userName +  "</li>" );
                }



            });

            $( "<ul/>", {
              "class": "my-new-list",
              html: items.join( "" )
            }).appendTo( "ol" );
          });
        })
        .fail(function( jqXHR, textStatus ) {
          showOutput( "Failed: " + textStatus );
        });

    }


    loadData();
});