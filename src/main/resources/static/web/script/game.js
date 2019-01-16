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
    shipType: '',
    possibleCells: [],
    horizontalCells: [],
    verticalCells: [],
    adjacentCells: [],
    placingShip: true,
}

loadGamePlayerData();

function loadGamePlayerData() {
    $("#tableContainer").append(generateUserGrid("U", mainData.columnHeaders, mainData.rowHeaders));
    $("#tableContainerSalvos").append(generateUserGrid("S", mainData.columnHeaders, mainData.rowHeaders));
    getData();
    var userTable = document.getElementById("U");
    var salvoTable = document.getElementById("S");
    placeShips(userTable);
    allowedGridCells();


}

function letter(number) {
    if (number == 1) {
        return number = 'A';
    } else if (number == 2) {
        return number = 'B';
    } else if (number == 3) {
        return number = 'C';
    } else if (number == 4) {
        return number = 'D';
    } else if (number == 5) {
        return number = 'E';
    } else if (number == 6) {
        return number = 'F';
    } else if (number == 7) {
        return number = 'G';
    } else if (number == 8) {
        return number = 'H';
    } else if (number == 9) {
        return number = 'I';
    } else if (number == 10) {
        return number = 'J';
    } else {
        return null;
    }
}

function number(letter) {
    if (letter == 'A') {
        return letter = 1;
    } else if (letter == 'B') {
        return letter = 2;
    } else if (letter == 'C') {
        return letter = 3;
    } else if (letter == 'D') {
        return letter = 4;
    } else if (letter == 'E') {
        return letter = 5;
    } else if (letter == 'F') {
        return letter = 6;
    } else if (letter == 'G') {
        return letter = 7;
    } else if (letter == 'H') {
        return letter = 8;
    } else if (letter == 'I') {
        return letter = 9;
    } else if (letter == 'J') {
        return letter = 10;
    } else {
        return null;
    }
}

function placeShips(table) {
    table.addEventListener('click', (e) => {
        if (e.target.nodeName.toUpperCase() === 'TD') {
            if (mainData.placingShip == true) {
                mainData.adjacentCells = [];
                mainData.verticalCells = [];
                mainData.horizontalCells = [];
                var gameId = e.target.id.toString();
                var rowHeader = gameId.charAt(1);
                var columnHeader = gameId.charAt(2);
                var adjacentRows = number(rowHeader);
                var shipLocation = rowHeader + columnHeader;
                mainData.shipLocation.push(shipLocation);
                var adjacentColumns = parseInt(columnHeader);
                for (var i = 1; i < 5; i++) {
                    if ((adjacentColumns + i) < 11) {
                        var cell = rowHeader + (adjacentColumns + i);
                        mainData.adjacentCells.push(cell)
                    }
                    if ((adjacentColumns - i) > 0) {
                        var cell = rowHeader + (adjacentColumns - i);
                        mainData.adjacentCells.push(cell);
                    }
                    if ((adjacentRows + i) < 11) {
                        var row = letter(adjacentRows + i);
                        var cell = row + adjacentColumns;
                        mainData.adjacentCells.push(cell);
                    }
                    if ((adjacentRows - i) > 0) {
                        var row = letter(adjacentRows - i);
                        var cell = row + adjacentColumns;
                        mainData.adjacentCells.push(cell);
                    }
                }
                console.log(mainData.adjacentCells)
                e.target.classList.add('clicked');
            }

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

function allowedGridCells() {
    for (var i = 0; i < mainData.rowHeaders.length; i++) {
        for (var j = 1; j < mainData.columnHeaders.length; j++) {
            mainData.possibleCells.push(mainData.rowHeaders[i] + mainData.columnHeaders[j])
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
    mainData.placingShip = true;
    mainData.shipType = ship;
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
        .then(r => {

            if (r.status == 403) {
                swal("Denied", "All ships have been placed");
            } else {
                r.json().then(location.reload());
            }
        })


        .catch(e => console.log(e))
}
