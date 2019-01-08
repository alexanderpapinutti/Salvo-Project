var modal = document.getElementById('modal-wrapper');
var errorMsg = document.getElementById("errorMsg");

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

            
            if (response.currentPlayer.userName != null) {
                document.getElementById('logged-user').innerHTML = '<p class="logged_in_user">You are logged in as "'+response.currentPlayer.userName+'"</p>';
                document.getElementById('profile-login').innerHTML = 'Logout';
            } else {
                clearUsername();
            } 
        })

        .catch(e => console.log(e))

}

function clearUsername () {
    document.getElementById('logged-user').innerHTML = '';
}

function openForm() {
    errorMsg.innerHTML = '';
    let loginToggle = document.getElementById('profile-login').innerHTML;
    if (loginToggle == "Login/Register") {
        showForm();
    } else {
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
                    console.log(r)
                    document.getElementById("profile-login").innerHTML = 'Login/Register';
                    clearUsername();
                    isLogedIn()
                }
            })
            .catch(e => console.log(e))

    }

}

function closeForm() {
    document.getElementById("modal-wrapper").style.display = "none";
}

function showForm () {
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
            console.log(r)
            if (r.status == 200) {

                document.getElementById('profile-login').innerHTML = 'Logout';
                closeForm();
                swal("Success!","You Logged In Successfully")
                isLogedIn();
                //                document.getElementById('logged-user').innerHTML = '<h4> Welcome ' + username + '</h4>';
            } else if (r.status == 401) {
                document.getElementById("errorMsg").innerHTML = '<p>*Enter a valid User Name or Password</p>';
            }
        })
        .catch(e => console.log(e))

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
        $('#myTable').append(grid);
    })
}

isLogedIn();

loadLeaderBoard();
