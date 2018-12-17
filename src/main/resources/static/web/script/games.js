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
function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

function login() {

    fetch("/api/login", {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'userName=j.bauer@ctu.gov&password=123',
        })
        .then(r => {
            if (r.status == 200) {
                console.log(r)
            }
        })
        .catch(e => console.log(e))
}

//var modal = document.getElementById('id01');
//
//// When the user clicks anywhere outside of the modal, close it
//window.onclick = function(event) {
//  if (event.target == modal) {
//    modal.style.display = "none";
//  }
//}

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
