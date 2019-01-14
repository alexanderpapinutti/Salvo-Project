var modal = document.getElementById('modal-wrapper');
var errorMsg = document.getElementById("errorMsg");

const mainData = {
    numberOfPlayers: '',
}

function show(elementId) {
    $("#" + elementId).show();
}

function hide(elementId) {
    $("#" + elementId).hide();
}

window.onclick = function (event) {
    if (event.target == modal) {
        hide('modal-wrapper');
    }
}

function createNewGame() {
    fetch("/api/games", {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
        .then(r => r.json())
        .then(r => location.replace('/web/game.html?gp=' + r.newGamePlayerId))
        .catch(e => console.log(e))

}

function isLogedIn() {
    $.getJSON("/api/games", function (response) {
        if (response.currentPlayer != null) {
            document.getElementById('logged-user').innerHTML = '<p class="logged_in_user">You are logged in as <div id="current-player">' + response.currentPlayer.userName + '</div></p>';
            document.getElementById('profile-login').innerHTML = 'Logout';
            show("games-list");
            loadGameList();
            show("create_game");

        } else {
            clearUsername();
            hide("games-list");
            hide("create_game");
        }
    })
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
        show("modal-wrapper");
    } else {
        logOut();
    }

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
                hide("modal-wrapper")
                login();
                isLogedIn();
                document.getElementById('profile-login').innerHTML = 'Logout';
            }
            if (r.status == 409) {
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
                hide("modal-wrapper");
                swal("Success!", "You Logged In Successfully")
                isLogedIn();
                document.getElementById
            } else if (r.status == 401) {
                document.getElementById("errorMsg").innerHTML = '<p>*Enter a valid User Name or Password</p>';
            }
        })
        .catch(e => console.log(e))
}

function joinGame(gameId, numberOfPlayers) {
    fetch('/api/games/' + gameId + '/players', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
        .then(r => r.json())
        .then(r => location.replace('/web/game.html?gp=' + r.newGamePlayerId))
        .catch(e => console.log(e))
}

function loadGameList() {
    $.getJSON("/api/games", function (data) {
        $('#logged_player_games').empty();
        var grid = "<div class='scroll-table'>"
        grid += "<table class='table table-hover table-dark'>";
        grid += '<tbody>';
        grid += '<tr>';
        grid += '<th id=leader-board-header>Game Id</th>';
        grid += '<th id=leader-board-header>Number of Players</th>';
        grid += '<th id=leader-board-header>Continue Playing</th>';
        grid += '</tr>';
        var numberOfGames = data.games.length;
        var enemy, user, gamePlayerId, numberOfPlayers, gameId;
        for (var i = 0; i < numberOfGames; i++) {
            gameId = data.games[i].gameId;
            numberOfPlayers = data.games[i].gamePlayers.length;
            grid += '<tr>';
            if (data.games[i].gamePlayers[1] != null) {
                var player1 = data.games[i].gamePlayers[1].player.userName;
                var gamePlayerId1 = data.games[i].gamePlayers[1].gamePlayerId;
                var player2 = data.games[i].gamePlayers[0].player.userName
                var gamePlayerId2 = data.games[i].gamePlayers[0].gamePlayerId;
                grid += "<td id='game-id'>" + gameId + "</td>";
                grid += "<td>2</td>";
                if (player1 == data.currentPlayer.userName) {
                    grid += "<td id='leader-board-column'><button id='return-game-button'><a href='game.html?gp=" + gamePlayerId1 + "'>Return</a></button></td>";
                } else if (player2 == data.currentPlayer.userName) {
                    grid += "<td id='leader-board-column'><button id='return-game-button'><a href='game.html?gp=" + gamePlayerId2 + "'>Return</a></button></td>";
                } else {
                    grid += "<td id='leader-board-column'></td>";
                }
            } else if (data.currentPlayer.userName == data.games[i].gamePlayers[0].player.userName) {
                gamePlayerId = data.games[i].gamePlayers[0].gamePlayerId;
                grid += "<td id='game-id'>" + gameId + "</td>";
                grid += "<td>" + numberOfPlayers + "</td>";
                grid += "<td id='leader-board-column'><button id='return-game-button'><a href='game.html?gp=" + gamePlayerId + "'>Return</a></button></td>"

            } else {
                mainData.numberOfPlayers = numberOfPlayers;
                gamePlayerId = data.games[i].gamePlayers[0].gamePlayerId;
                grid += "<td id='game-id'>" + gameId + "</td>";
                grid += "<td>" + mainData.numberOfPlayers + "</td>";
                grid += "<td id='leader-board-column'><button id='join_game' onclick='joinGame("+gameId+")'>Join</button></td>";
                
            }
            grid += "</tr>";
        }
        grid += '</tbody>'
        grid += '</table>'
        grid += '</div>'
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
