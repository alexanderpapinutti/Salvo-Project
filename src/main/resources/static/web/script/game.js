const mainData = {
    userShips: [],
    userSalvos: [],
    enemySalvos: [],
    columnHeaders: ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    rowHeaders: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    player1: '',
    player2: '',
}

loadGamePlayerData();

function loadGamePlayerData() {

    $("#tableContainer").append(generateUserGrid("U", mainData.columnHeaders, mainData.rowHeaders));
    $("#tableContainerSalvos").append(generateUserGrid("S", mainData.columnHeaders, mainData.rowHeaders));
    getData();

}

function generateUserGrid(tableId, columnHeaders, rowHeaders) {
    let rows = rowHeaders.length;
    let cols = columnHeaders.length;
    var grid = "<table>";
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
        $("#this-game-players").append(displayPlayers(mainData.player1, mainData.player2));
    })
}

function displayPlayers(player1, player2) {
    var display = "<p>";
    display += player1 + "(you) vs. " + player2;
    display += "</p>";
    return display;
}


//fetch("/api/logout", {
//        credentials: 'include',
//        method: 'POST',
//        headers: {
//            'Accept': 'application/json',
//            'Content-Type': 'application/x-www-form-urlencoded'
//        },
//    })
//    .then(r => {
//        if (r.status == 200) {
//            console.log(r)
//        }
//    })
//    .catch(e => console.log(e))
//
//fetch("/api/login", {
//        credentials: 'include',
//        method: 'POST',
//        headers: {
//            'Accept': 'application/json',
//            'Content-Type': 'application/x-www-form-urlencoded'
//        },
//    body: 'userName=j.bauer@ctu.gov&password=123',
//    })
//    .then(r => {
//        if (r.status == 200) {
//            console.log(r)
//        }
//    })
//    .catch(e => console.log(e))
