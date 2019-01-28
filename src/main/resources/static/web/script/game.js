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
    adjacentCells: [],
    shipPlacementSteps: 0,
    shipsArray: [],
    locationsArray: [],
    topCells: [],
    bottomCells: [],
    rightCells: [],
    leftCells: [],
    firstClickId: '',
    shipSize: '',
    placedShips: [],
    occupiedCells: [],
    possibleCells: [],
    userGuesses: [],
    hits: [],
    enemyHits:[],
}

function activateModal() {
    var modal = document.getElementById('myModal');

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function () {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
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

function commonElements(arr1, arr2) {
    return arr1.some(function (el) {
        return arr2.indexOf(el) > -1;
    });
}

function resetCells() {
    mainData.adjacentCells = [];
    mainData.topCells = [];
    mainData.bottomCells = [];
    mainData.rightCells = [];
    mainData.leftCells = [];
    mainData.possibleCells = [];
}

function setPossibleCells(array) {
    if (array.length == mainData.shipSize) {
        for (var i = 0; i < array.length; i++) {
            mainData.possibleCells.push(array[i]);
        }
    }
}

function findAdjacentCells(e) {
    resetCells();
    var firstCellId = e.target.id.toString();
    var rowHeader = firstCellId.charAt(1);
    var columnHeader = firstCellId.charAt(2);
    var newColumnHeader;
    if (firstCellId.charAt(3) != null) {
        newColumnHeader = columnHeader + firstCellId.charAt(3);
    } else {
        newColumnHeader = columnHeader;
    }
    var adjacentRows = number(rowHeader);
    var shipLocation = rowHeader + newColumnHeader;
    mainData.adjacentCells.push(shipLocation);
    mainData.rightCells.push(shipLocation);
    mainData.leftCells.push(shipLocation);
    mainData.bottomCells.push(shipLocation);
    mainData.topCells.push(shipLocation);
    var adjacentColumns = parseInt(newColumnHeader);
    for (var i = 1; i < mainData.shipSize; i++) {
        if ((adjacentColumns + i) < 11) {
            var cell = rowHeader + (adjacentColumns + i);
            mainData.rightCells.push(cell);
            mainData.adjacentCells.push(cell);
        }
        if ((adjacentColumns - i) > 0) {
            var cell = rowHeader + (adjacentColumns - i);

            mainData.leftCells.push(cell);
            mainData.adjacentCells.push(cell);
        }
        if ((adjacentRows + i) < 11) {
            var row = letter(adjacentRows + i);
            var cell = row + adjacentColumns;

            mainData.bottomCells.push(cell);
            mainData.adjacentCells.push(cell);
        }
        if ((adjacentRows - i) > 0) {
            var row = letter(adjacentRows - i);
            var cell = row + adjacentColumns;

            mainData.topCells.push(cell);
            mainData.adjacentCells.push(cell);
        }
    }
    setPossibleCells(mainData.topCells);
    setPossibleCells(mainData.bottomCells);
    setPossibleCells(mainData.leftCells);
    setPossibleCells(mainData.rightCells);

    e.target.classList.add('clicked');
}

function setShipOrientation(idOfSecondClick) {
    if ($.inArray(idOfSecondClick, mainData.topCells) > -1) {
        validateDirection(mainData.topCells)
    } else if ($.inArray(idOfSecondClick, mainData.bottomCells) > -1) {
        validateDirection(mainData.bottomCells)
    } else if ($.inArray(idOfSecondClick, mainData.leftCells) > -1) {
        validateDirection(mainData.leftCells)
    } else if ($.inArray(idOfSecondClick, mainData.rightCells) > -1) {
        validateDirection(mainData.rightCells)
    } else {
        swal('cannot place ship diagonally');
        document.getElementById("U" + mainData.firstClickId).classList.remove("clicked");
    }
}

function validateDirection(array) {
    if (array.length == mainData.shipSize) {
        if (mainData.occupiedCells.length == 0) {
            mainData.locationsArray.push(array);
            for (var i = 0; i < array.length; i++) {
                mainData.occupiedCells.push(array[i]);
            }
            mainData.placedShips.push(mainData.shipType);
        } else if (commonElements(mainData.occupiedCells, array) == true) {
            swal("cannot place ships on top of other ships");
            document.getElementById("U" + mainData.firstClickId).classList.remove("clicked");
        } else {
            mainData.placedShips.push(mainData.shipType);
            mainData.locationsArray.push(array);
            for (var i = 0; i < array.length; i++) {
                mainData.occupiedCells.push(array[i]);
            }
        }
    } else {
        swal("cannot place ship outside of grid");
        document.getElementById("U" + mainData.firstClickId).classList.remove("clicked");
    }
}

function setClickId(e) {
    var firstCellId = e.target.id.toString();
    var rowHeader = firstCellId.charAt(1);
    var columnHeader = firstCellId.charAt(2);
    var newColumnHeader;
    if (firstCellId.charAt(3) != null) {
        newColumnHeader = columnHeader + firstCellId.charAt(3);
    } else {
        newColumnHeader = columnHeader;
    }
    var adjacentRows = number(rowHeader);
    var clickId = rowHeader + newColumnHeader;
    return clickId;
}

function clickSalvoCell(table) {
    table.addEventListener('click', (e) => {
        if (e.target.id != "") {
            $("#ship-selection").hide();
            $("#salvo-submission").show();
            if (e.target.classList == "salvo-location") {
                swal("Cannot place guess in same cell more than once")
            }
            if (mainData.userGuesses.length < 5) {
                if (e.target.classList == "salvo-location") {
                    swal("Connot place shots on top of shots fired")
                } else {
                    mainData.userGuesses.push(setClickId(e));
                    e.target.classList.remove('emptyCells');
                    e.target.classList.add('user-guess');
                }


            } else {
                swal("All salvos have been placed");
            }
        }

    });
}

function removePossibleCells(array, setclass) {
    for (var i = 0; i < array.length; i++) {
        $("#U" + array[i]).removeClass(setclass);
        $("#U" + array[i]).addClass("emptyCells");
    }
}

function fillPossibleCells(array, setclass) {
    for (var i = 0; i < array.length; i++) {
        $("#U" + array[i]).addClass(setclass);
        $("#U" + array[i]).removeClass("emptyCells");
    }
}

function fillOccupiedCells() {
    for (var i = 0; i < mainData.locationsArray.length; i++) {
        for (var j = 0; j < mainData.locationsArray[i].length; j++) {
            $("#U" + mainData.locationsArray[i][j]).addClass("clicked");
        }

    }
}

function hideUsedShips() {
    for (var k = 0; k < mainData.placedShips.length; k++) {
        $("#" + mainData.placedShips[k]).hide();
    }
}

function clickShip(table) {
    table.addEventListener('click', (e) => {
        if (e.target.id !== "") {
            if (mainData.shipPlacementSteps == 1) {
                mainData.firstClickId = setClickId(e);
                findAdjacentCells(e);
                fillPossibleCells(mainData.possibleCells, "possible-cell")
                mainData.shipPlacementSteps = 2;
            } else if (mainData.shipPlacementSteps == 2) {
                setShipOrientation(setClickId(e));
                removePossibleCells(mainData.possibleCells, "possible-cell");
                fillOccupiedCells();
                hideUsedShips();
                if (mainData.placedShips.length == 5) {
                    mainData.shipPlacementSteps = 3;
                    $("#ship-submission").css("background", "green")
                } else {
                    mainData.shipPlacementSteps = 0;
                }

            }
        }
    });
}

function setClickId(e) {
    var firstCellId = e.target.id.toString();
    var rowHeader = firstCellId.charAt(1);
    var columnHeader = firstCellId.charAt(2);
    var newColumnHeader;
    if (firstCellId.charAt(3) != null) {
        newColumnHeader = columnHeader + firstCellId.charAt(3);
    } else {
        newColumnHeader = columnHeader;
    }
    var adjacentRows = number(rowHeader);
    var clickId = rowHeader + newColumnHeader;
    return clickId;
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
    if (arrayOfSalvos != null) {
        for (var i = 0; i < arrayOfSalvos.length; i++) {
            let salvos = arrayOfSalvos[i].locations;
            for (var j = 0; j < salvos.length; j++) {
                let idLocation = salvos[j];
                $(tableID + idLocation).removeClass('emptyCells').addClass(classID);
                //                $(tableID + idLocation).html(arrayOfSalvos[i].turn);
            }
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

function setGamePlayerId(data) {
    for (var i = 0; i < data.game.gamePlayers.length; i++) {
        if (data.game.gamePlayers[i].player.userName == data.userInfo.userName) {
            mainData.gamePlayerId = data.game.gamePlayers[i].gamePlayerId;
        }
    }

}

function deleteSalvos() {
    var cancelPlacement = mainData.userGuesses.pop();
    $("#S" + cancelPlacement).removeClass("user-guess");
    $("#S" + cancelPlacement).addClass("emptyCells");
}

function deleteShips() {
    var removeLocations = mainData.locationsArray.pop();
    var removeShip = mainData.placedShips.pop();
    $("#" + removeShip).show()
    for (var i = 0; i < removeLocations.length; i++) {
        document.getElementById("U" + removeLocations[i]).classList.remove("clicked");
        mainData.occupiedCells.pop();
    }
    $("#ship-submission").css("background", "black")
}

function postShips() {
    if (mainData.shipPlacementSteps == 3) {
        for (var i = 0; i < mainData.placedShips.length; i++) {
            fetch("/api/games/players/" + mainData.gamePlayerId + "/ships", {
                    credentials: 'include',
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify([{
                        type: mainData.placedShips[i],
                        location: mainData.locationsArray[i],
            }]),
                })
                .then(r => {
                    if (r.status == 403) {
                        swal("Denied", "All ships have been placed");
                        mainData.shipPlacementSteps = 0;
                    } else {

                        r.json().then(location.reload());
                        
                        mainData.shipPlacementSteps = 4;
                    }
                })
                .catch(e => console.log(e))
        }

    }
}

function postSalvos() {
    fetch("/api/games/players/" + mainData.gamePlayerId + "/salvos", {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                locations: mainData.userGuesses,
            }),
        })
        .then(r => {
            if (r.status == 403) {
                swal("Denied", "Max guesses limit reached");
            } else {

                r.json().then(location.reload());

            }
        })
        .catch(e => console.log(e))
}

function setShip(ship) {
    mainData.shipPlacementSteps = 1;
    mainData.shipType = ship;
    setShipSize(ship);
    if ($.inArray(mainData.shipType, mainData.placedShips) > -1) {
        alert('duplicate');
        mainData.shipPlacementSteps = 0;
    }
}

function setShipSize(ship) {
    if (ship == 'Aircraft-Carrier') {
        mainData.shipSize = 5;
    } else if (ship == 'Battleship') {
        mainData.shipSize = 4;
    } else if (ship == 'Submarine') {
        mainData.shipSize = 3;
    } else if (ship == 'Destroyer') {
        mainData.shipSize = 3;
    } else if (ship == 'Patrol-Boat') {
        mainData.shipSize = 2;
    } else {

    }
}

function showElement(elementId) {
    $("#" + elementId).show();
}

function hideElement(elementId) {
    $("#" + elementId).hide();
}

function gameDetails() {
    showElement("modal-wrapper");
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
        if (data.enemyInfo != null) {
            mainData.player2 = data.enemyInfo.userName;
            document.getElementById("player1").innerHTML = mainData.player1;
            document.getElementById("player2").innerHTML = mainData.player2;
        } else {
            document.getElementById("player1").innerHTML = mainData.player1;
            document.getElementById("player2").innerHTML = "Waiting for Opponnent...";
        }
        setGamePlayerId(data);
    })
}

function loadGamePlayerData() {
    $("#tableContainer").append(generateUserGrid("U", mainData.columnHeaders, mainData.rowHeaders));
    $("#tableContainerSalvos").append(generateUserGrid("S", mainData.columnHeaders, mainData.rowHeaders));
    getData();
    $("#salvo-submission").hide();
    $("#ship-submission").show();
    var userTable = document.getElementById("U");
    var salvoTable = document.getElementById("S");
    clickShip(userTable);
    clickSalvoCell(salvoTable);
    activateModal();
    deleteSalvos();
}

loadGamePlayerData();
