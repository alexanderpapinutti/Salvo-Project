$(function () {

    const columnHeaders = ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    const rowHeaders = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    
    function indexCompare (){
        
    }
    
    function loadGamePlayerData() {
        var urlParams = new URLSearchParams(window.location.search);

        var entries = urlParams.entries();
        for (player of entries) {
            $.get("/api/game_view/" + player[1])
                .done(function (data) {
                    $.getJSON("/api/game_view/" + player[1], function (data) {
                        var numberOfShips = data.userShips.length;
                        var shipsTypes = [];
                        var shipsLocations = [];
                        for (var i = 0; i < numberOfShips; i++) {
                            shipsTypes.push(data.userShips[i].type)
                            for (var j = 0; j < 5; j++) {
                                if (data.userShips[i].locations[j] != null) {
                                    shipsLocations.push(data.userShips[i].locations[j]);
                                }

                            }

                        }
                        
                        console.log(shipsLocations);

                        function generateGrid(rows, cols) {
                            var grid = "<table>";
                            for (row = 0; row <= rows; row++) {
                                grid += "<tr>";
                                var indexRow = $("tr").index(this) + row + 2;
                                for (col = 0; col <= cols; col++) {
                                    var indexColumn = $("td").index(this) + col + 2;
                                    if (indexRow == 1) {
                                        grid += "<td class='myColumnHeaders'>" + columnHeaders[col] + "</td>";
                                    } else if (indexColumn == 1) {
                                        grid += "<td class='myRowHeaders'>" + rowHeaders[row - 1] + "</td>"
                                    } else {
                                        grid += "<td class='emptyCells'>"+ rowHeaders[row - 1]+ columnHeaders[col] + "</td>";
                                    
                                    }
                                }
                                grid += "</tr>";

                            }

                            return grid;
                        }

                        $("#tableContainer").append(generateGrid(10, 10));
                        
                        $("td").click(function () {
                            $("td").css('background-color', 'white');
                            var index = $("td").index(this);
                            var row = Math.floor((index) / 11) - 1;
                            
                            var col = (index % 11);
                            console.log(col,row);
//                            console.log(rowHeaders[row]);
                            
                            $("span").text("That was row " + rowHeaders[row] + " and col " + col);
                            $(this).css('background-color', 'red');

                        });
                    });
                })
                .fail(function (jqXHR, textStatus) {
                    console.log("Failed: " + textStatus);
                });
        }
        
    }

    loadGamePlayerData();

});
