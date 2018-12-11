function loadData() {

    $.getJSON("/api/games", function (data) {
        var items = [];
        $.each(data, function (key, val) {
            var player1 = val.gamePlayers[0].player.email;

            if (val.gamePlayers[1] == null) {
                items.push("<li id='listItem'>" + val.id + ". " + val.created + ": " + player1 + "</li");
            } else {
                items.push("<li id='listItem'>" + val.id + ". " + val.created + ": " + player1 + ", " + val.gamePlayers[1].player.email + "</li>");
            }



        });

        $("<ul/>", {
            "class": "my-new-list",
            html: items.join("")
        }).appendTo("ol");
    });

}



loadData();
