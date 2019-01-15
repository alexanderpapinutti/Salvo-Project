const mainData = {
    userShips: [],
    userSalvos: [],
    enemySalvos: [],
    columnHeaders: ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    rowHeaders: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    player1: '',
    player2: '',
    gamePlayerId: '',
    userTable: '',
    shipLocation: [],
}

loadGamePlayerData();

function loadGamePlayerData() {
    $("#tableContainer").append(generateUserGrid("U", mainData.columnHeaders, mainData.rowHeaders));
    $("#tableContainerSalvos").append(generateUserGrid("S", mainData.columnHeaders, mainData.rowHeaders));
    getData();
    var userTable = document.getElementById("U");
    var salvoTable = document.getElementById("S");
    placeShips(userTable);
    

}

function placeShips(table) {
    table.addEventListener('click', (e) => {
        if (e.target.nodeName.toUpperCase() === 'TD') {
            var gameId = e.target.id.toString();
            var shipLocation = gameId.charAt(1) + gameId.charAt(2);
            mainData.shipLocation.push(shipLocation);
            console.log(mainData.shipLocation)
           
            e.target.classList.add('clicked');
        }
    });
}

function generateUserGrid(tableId, columnHeaders, rowHeaders) {
    let rows = rowHeaders.length;
    let cols = columnHeaders.length;
    var grid = "<table id='" + tableId + "'>";

    for (row = 0; row <= rows; row++) {
        grid += "<tr>";
        var indexRow = $("tr").index(this) + row + 2;
        for (col = 0; col < cols; col++) {
            var indexColumn = $("td").index(this) + col + 2;
            if (indexRow == 1) {
                grid += "<td class='myColumnHeaders'><div class='center'>" + columnHeaders[col] + "</div></td>";
            } else if (indexColumn == 1) {
                grid += "<td class='myRowHeaders'>" + rowHeaders[row - 1] + "</td>"
            } else {
                grid += "<td class='emptyCells' id=" + tableId + rowHeaders[row - 1] + columnHeaders[col] + "></td>";
            }
        }
        grid += "</tr>";

    }


    return grid;
}

function printSalvos(tableID, arrayOfSalvos, classID) {
    for (var i = 0; i < arrayOfSalvos.length; i++) {
        let salvos = arrayOfSalvos[i].locations;
        for (var j = 0; j < salvos.length; j++) {
            let idLocation = salvos[j];
            $(tableID + idLocation).removeClass('emptyCells').addClass(classID);
            $(tableID + idLocation).html(arrayOfSalvos[i].turn);
        }
    }
}

function printShips(arrayOfShips) {
    for (var i = 0; i < arrayOfShips.length; i++) {
        let shipLocations = arrayOfShips[i].locations;
        let shipType = arrayOfShips[i].type;
        for (var j = 0; j < shipLocations.length; j++) {
            let location = shipLocations[j];
            $("#U" + location).removeClass('emptyCells').addClass('ship-location ' + shipType);
        }
    }
}

function getData() {
    $.getJSON("/api/game_view/" + location.search.split("=")[1], function (data) {
        console.log(data)
        mainData.userShips = data.userShips;
        mainData.userSalvos = data.userSalvos;
        mainData.enemySalvos = data.enemySalvos;
        printShips(mainData.userShips);
        printSalvos('#S', mainData.userSalvos, 'salvo-location');
        printSalvos('#U', mainData.enemySalvos, 'enemy-guess');
        mainData.player1 = data.userInfo.userName;
        mainData.player2 = data.enemyInfo.userName;
        setGamePlayerId(data);
        displayPlayers(mainData.player1, mainData.player2);
    })
}

function setGamePlayerId(data) {
    for (var i = 0; i < data.game.gamePlayers.length; i++) {
        if (data.game.gamePlayers[i].player.userName == data.userInfo.userName) {
            mainData.gamePlayerId = data.game.gamePlayers[i].gamePlayerId;
        }
    }

}


function displayPlayers(player1, player2) {
    document.getElementById("player1").innerHTML = player1;
    document.getElementById("player2").innerHTML = player2;
}

function setShip(ship) {

    fetch("/api/games/players/" + mainData.gamePlayerId + "/ships", {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([{
                type: ship,
                location: mainData.shipLocation
            }]),
        })
        .then (r => {
            
            if (r.status == 403){
                alert("All ships have been added");
            }else {
                r.json().then(location.reload());
            }
        })

        
        .catch(e => console.log(e))
}
