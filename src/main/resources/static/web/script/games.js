//function loadData() {
//
//    $.getJSON("/api/games", function (data) {
//        var items = [];
//        $.each(data, function (key, val) {
//            var player1 = val.gamePlayers[0].player.email;
//
//            if (val.gamePlayers[1] == null) {
//                items.push("<li id='listItem'>" + val.id + ". " + val.created + ": " + player1 + "</li");
//            } else {
//                items.push("<li id='listItem'>" + val.id + ". " + val.created + ": " + player1 + ", " + val.gamePlayers[1].player.email + "</li>");
//            }
//
//
//
//        });
//
//        $("<ul/>", {
//            "class": "my-new-list",
//            html: items.join("")
//        }).appendTo("ol");
//    });
//
//
//}
//
//loadData();

function loadLeaderBoard() {
    $.getJSON("/api/leaderBoard", function (data) {
        var grid = "<table class='table table-hover table-dark'>";

        grid += '<tbody>';
        grid += '<tr>';
        grid += '<th id=leader-board-header>Name</th>';
        grid += '<th id=leader-board-header>Total</th>';
        grid += '<th id=leader-board-header>Won</th>';
        grid += '<th id=leader-board-header>Lost</th>';
        grid += '<th id=leader-board-header>Tied</th>';
        grid += '</tr>';
        let rows = data.length;
        //        tenPercentArray(sortTopTen("votes_with_party_pct"), "votes_with_party_pct");
        //        
        //        function tenPercentArray(array, sortkey) {
        //            var empty = [];
        //            for (var i = 0; i < array.length; i++) {
        //                if (i < (array.length * 0.1)) {
        //                    empty.push(array[i]);
        //                } else if (array[i - 1][sortkey] == array[i][sortkey]) {
        //                    empty.push(array[i]);
        //                } else {
        //                    break;
        //                }
        //            }
        //            return empty;
        //        }

        var byProperty = function (prop) {
            return function (a, b) {
                if (typeof a[prop] == "number") {
                    return (b[prop] - a[prop]);
                } else {
                    return ((a[prop] < b[prop]) ? 1 : ((a[prop] > b[prop]) ? -1 : 0));
                }
            };
        };
        
        data.sort(byProperty('total'));

        for (var i = 0; i < rows; i++) {

            grid += "<tr>";
            grid += "<td id='leader-board-column'>" + data[i].email + "</td>";
            grid += "<td id='leader-board-column'>" + data[i].total + "</td>";
            grid += "<td id='leader-board-column'>" + data[i].wins + "</td>";
            grid += "<td id='leader-board-column'>" + data[i].lost + "</td>";
            grid += "<td id='leader-board-column'>" + data[i].ties + "</td>";
            grid += "</tr>";

        }


        grid += '</tbody>';
        grid += '</table>';
        $('#myTable').append(grid);
    })
}

loadLeaderBoard();

function sortLeaderBoard(sortkey, data) {
    var allRows;
    allRows = data;
    allRows.sort(function (a, b) {
        return b[sortkey] - a[sortkey]
    });
    console.log(allRows)
    return allRows;
}
