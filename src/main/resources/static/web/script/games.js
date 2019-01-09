var modal = document.getElementById('modal-wrapper');
var errorMsg = document.getElementById("errorMsg");

function showGameList() {
    document.getElementById("games-list").style.display = 'block';
}

function hideGameList() {
    document.getElementById("games-list").style.display = 'none';
}

window.onclick = function (event) {
    if (event.target == modal) {
        closeForm();
    }
}

function isLogedIn() {
    fetch("/api/games", {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
        .then(r => r.json())
        .then(response => {
            if (response.currentPlayer != null) {
                document.getElementById('logged-user').innerHTML = '<p class="logged_in_user">You are logged in as "' + response.currentPlayer.userName + '"</p>';
                document.getElementById('profile-login').innerHTML = 'Logout';
                showGameList();
                loadGameList();

            } else {
                clearUsername();
                hideGameList();
            }
        })

        .catch(e => console.log(e))

}

function clearUsername() {
    document.getElementById('logged-user').innerHTML = '';
}

function logOut() {
    fetch("/api/logout", {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
        .then(r => {
            if (r.status == 200) {
                document.getElementById("profile-login").innerHTML = 'Login/Register';
                clearUsername();
                isLogedIn();
            }
        })
        .catch(e => console.log(e))
}

function openForm() {
    errorMsg.innerHTML = '';
    let loginToggle = document.getElementById('profile-login').innerHTML;
    if (loginToggle == "Login/Register") {
        showForm();
    } else {
        logOut();
    }

}

function closeForm() {
    document.getElementById("modal-wrapper").style.display = "none";
}

function showForm() {
    document.getElementById("modal-wrapper").style.display = "block";
}

function signUp() {
    var username = $("#username").val();
    var password = $("#password").val();
    fetch("/api/players", {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'userName=' + username + '&password=' + password,
        })

        .then(r => {
            if (r.status == 201) {
                closeForm();
                login();
                isLogedIn();
                document.getElementById('profile-login').innerHTML = 'Logout';
            }
            if (r.status == 409) {
                console.log(r)
                errorMsg.innerHTML = '*Account already in use';
            }
        })
        .catch(e => console.log(e))

}

function login() {

    var username = $("#username").val();
    var password = $("#password").val();
    fetch("/api/login", {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'userName=' + username + '&password=' + password,
        })
        .then(r => {
            if (r.status == 200) {
                document.getElementById('profile-login').innerHTML = 'Logout';
                closeForm();
                swal("Success!", "You Logged In Successfully")
                isLogedIn();
            } else if (r.status == 401) {
                document.getElementById("errorMsg").innerHTML = '<p>*Enter a valid User Name or Password</p>';
            }
        })
        .catch(e => console.log(e))
}

function loadGameList() {    
    $.getJSON("/api/games", function (data) {
        var player = data.currentPlayer.userName;
        $('#logged_player_games').empty();
        var grid = "<table class='table table-hover table-dark'>";
        grid += '<tbody>';
        grid += '<tr>';
        grid += '<th id=leader-board-header>Game</th>';
        grid += '<th id=leader-board-header>Players</th>';
        grid += '<th id=leader-board-header>Continue Playing</th>';
        grid += '</tr>';
        var numberOfGames = data.games.length;
        for (var i = 0; i < numberOfGames; i++){
            console.log(data.games[i].creationDate)
            grid += "<tr>";
            grid += "<td id='leader-board-column'>" + data.games[i].creationDate + "</td>";           
            if (data.games[i].gamePlayers[1] != null){
                grid += "<td id='leader-board-column'>" + data.games[i].gamePlayers[0].player.userName+ " vs "+ data.games[i].gamePlayers[1].player.userName+ "</td>";
            }else {
                grid += "<td id='leader-board-column'>" + data.games[i].gamePlayers[0].player.userName+ "</td>";
            }
            grid += "<td id='leader-board-column'><button id='join_game' onclick='goToGamePage()'>Join</button></td>";
            grid += "</tr>";
        }
        grid += '</tbody>'
        grid += '</table>'
        $('#logged_player_games').append(grid);
    })

}

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
        $('#leaderBoard').append(grid);
    })
}

isLogedIn();

loadLeaderBoard();
