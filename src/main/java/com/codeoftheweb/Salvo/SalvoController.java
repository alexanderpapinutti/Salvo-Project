package com.codeoftheweb.Salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api")
public class SalvoController {

    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    private PlayerRepository playerRepository;
    @Autowired
    private GameRepository gameRepository;
    @Autowired
    private GamePlayerRepository gamePlayerRepository;
    @Autowired
    private ShipRepository shipRepository;
    @Autowired
    private SalvoRepository salvoRepository;
    @Autowired
    private ScoreRepository scoreRepository;

    @RequestMapping("/games")
    public Map<String, Object> getAll(Authentication authentication) {
        Map<String, Object> map = new HashMap<>();
        if(authentication != null) {
            map.put("currentPlayer", playerRepository.findByUserName(authentication.getName()));
        }
        map.put("games", gameRepository
                .findAll()
                .stream()
                .map(game -> makeGameDTO(game))
                .collect(Collectors.toList()));
        return map;
    }

    @RequestMapping(path = "/games", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> createNewGame(Authentication authentication) {
        if(authentication != null ){
            Game newGame = new Game();
            gameRepository.save(newGame);
            GamePlayer gamePlayer = new GamePlayer(currentPlayer(authentication), newGame);
            gamePlayerRepository.save(gamePlayer);
            return new ResponseEntity<>(makeMap("newGamePlayerId", gamePlayer.getId()), HttpStatus.CREATED);
        }else{
            return new ResponseEntity<>(makeMap("error", "Login to create game"), HttpStatus.UNAUTHORIZED);
        }
    }

    @RequestMapping(path = "/games/players/{gamePlayerId}/salvos", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> placeSalvos(@PathVariable Long gamePlayerId, @RequestBody Salvo salvo, Authentication authentication){
        GamePlayer gamePlayer = gamePlayerRepository.findOne(gamePlayerId);


        if(authentication == null){
            return new ResponseEntity<>(makeMap("error", "No user is logged in")
                    , HttpStatus.UNAUTHORIZED);
        }else if(gamePlayer.getPlayer() != currentPlayer(authentication)) {
            return new ResponseEntity<>(makeMap("error", "This is not your game")
                    , HttpStatus.UNAUTHORIZED);
        }else if(salvo.getLocations().size() > 5) {
            return new ResponseEntity<>(makeMap("error", "Too many shots fired")
                    , HttpStatus.FORBIDDEN);
        }else if(gamePlayer == null){
            return new ResponseEntity<>(makeMap("error", "This user does not exist")
                    , HttpStatus.FORBIDDEN);
        }else {

            salvo.setGamePlayer(gamePlayer);
            salvo.setTurn(getLastTurn(gamePlayer) + 1);
            salvoRepository.save(salvo);
            return new ResponseEntity<>(makeMap("success", "salvos posted"), HttpStatus.CREATED);
        }
    }

    @RequestMapping(path = "/games/players/{gamePlayerId}/ships", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> placeShips(@PathVariable Long gamePlayerId, @RequestBody List<Ship> ships, Authentication authentication) {
        GamePlayer gamePlayer = gamePlayerRepository.findOne(gamePlayerId);
        if(authentication == null){
            return new ResponseEntity<>(makeMap("error", "No user is logged in")
                    , HttpStatus.UNAUTHORIZED);
        }else if(gamePlayer == null){
            return new ResponseEntity<>(makeMap("error", "This user does not exist")
                    , HttpStatus.UNAUTHORIZED);
        }else if(gamePlayer.getPlayer() != currentPlayer(authentication)){
            return new ResponseEntity<>(makeMap("error", "This is not your game")
                    , HttpStatus.UNAUTHORIZED);
        }else if(gamePlayer.getShips().size() == 5) {
            return new ResponseEntity<>(makeMap("error", "Ships have already been placed")
                    , HttpStatus.FORBIDDEN);
        } else if (ships.isEmpty()) {
            return new ResponseEntity<>(makeMap("error", "Missing Ships")
                    , HttpStatus.FORBIDDEN);
        }else{
            for (Ship ship : ships) {
                ship.setGamePlayer(gamePlayer);
                shipRepository.save(ship);
            }
            return new ResponseEntity<>(makeMap("success", "Ships successfully added")
                    , HttpStatus.CREATED);
        }
    }

    @RequestMapping(path = "/games/{id}/players", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> joinGame(@PathVariable Long id, Authentication authentication) {
        if(authentication != null ) {
            if (gameRepository.findGameById(id).getPlayers().size() == 2){
                return new ResponseEntity<>(makeMap("error", "This game is full"), HttpStatus.FORBIDDEN);
            }else if (gameRepository.findGameById(id) == null){
                return new ResponseEntity<>(makeMap("error", "No such game"), HttpStatus.FORBIDDEN);
            }
            GamePlayer gamePlayer = new GamePlayer(currentPlayer(authentication), gameRepository.findGameById(id));
            gamePlayerRepository.save(gamePlayer);
            return new ResponseEntity<>(makeMap("newGamePlayerId", gamePlayer.getId()), HttpStatus.CREATED);
        }else{
            return new ResponseEntity<>(makeMap("error", "Can't join game"), HttpStatus.UNAUTHORIZED);
        }
    }

    @RequestMapping(path = "/players", method = RequestMethod.GET)
    public ResponseEntity<Map<String,Object>> getPlayer(Authentication authentication) {
        if (authentication != null){
            return  new ResponseEntity<Map<String, Object>>(makeMap("success", playerRepository.findByUserName(authentication.getName())), HttpStatus.OK);
        } else {
            return new ResponseEntity<Map<String, Object>>(makeMap("error","log in"), HttpStatus.UNAUTHORIZED);
        }
    }

    @RequestMapping(path = "/players", method = RequestMethod.POST)
    public ResponseEntity<Map<String,Object>> createPlayer(String userName, String password) {

        if (userName.isEmpty()){
            return new ResponseEntity<Map<String, Object>>(makeMap("error","Type in a name"), HttpStatus.FORBIDDEN);
        }
        Player player = playerRepository.findByUserName(userName);
        if(player != null){
            return new ResponseEntity<>(makeMap("error", "Username already exists"), HttpStatus.CONFLICT);
        }
        if (password.isEmpty()) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error","use a valid password"), HttpStatus.UNAUTHORIZED);
        }
        Player newPlayer = new Player(userName,password);
        playerRepository.save(newPlayer);
        return  new ResponseEntity<Map<String, Object>>(makeMap("success", "player created"), HttpStatus.CREATED);
    }

    @RequestMapping("/gamePlayers")
    public List<GamePlayer> getAllGamePlayers() {
        return gamePlayerRepository.findAll();
    }

    @RequestMapping("/leaderBoard")
    public List<Object> getLeaderBoard() {
        List<Object> list = new ArrayList<>();
        for (Player player : playerRepository.findAll()) {
            Map<String, Object> dto = new HashMap<>();
            dto.put("email", player.getUserName());
            double total = 0.0;
            int wins = 0;
            int ties = 0;
            int lost = 0;
            for (Score score : player.getScore()) {
                total += score.getScore();
                if (score.getScore() == 1.0) {
                    wins += 1;
                } else if (score.getScore() == 0.5) {
                    ties += 1;
                } else if (score.getScore() == 0.0) {
                    lost += 1;
                } else {

                }
            }
            dto.put("total", total);
            dto.put("wins", wins);
            dto.put("ties", ties);
            dto.put("lost", lost);
            list.add(dto);
        }
        return list;
    }

    @RequestMapping(value = "/game_view/{id}")
    public Map<String,Object> getURLById (@PathVariable Long id,
                                          Authentication authentication) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        GamePlayer gamePlayer = gamePlayerRepository.findOne(id);

        if (playerRepository.findByUserName(authentication.getName()).getId() == gamePlayer.getPlayer().getId()) {
            GamePlayer enemy = getEnemyGamePlayer(gamePlayer);
            dto.put("game", makeGameDTO(gamePlayer.getGame()));
            dto.put("userInfo", gamePlayer.getPlayer());
            dto.put("userShips", gamePlayer.getShips()
                    .stream().map(ship -> makeShipDTO(ship))
                    .collect(Collectors.toList()));
            dto.put("userSalvos", gamePlayer.getSalvos()
                    .stream()
                    .map(salvo -> makeSalvoDTO(salvo))
                    .collect(Collectors.toList()));
            dto.put("gameStatus", gameStatus(gamePlayer));

            if (enemy != null) {
                sinkShips(enemy.getShips());
                sinkShips(gamePlayer.getShips());
                dto.put("enemyInfo", enemy.getPlayer());
                dto.put("enemySalvos", enemy.getSalvos()
                        .stream()
                        .map(salvo -> makeSalvoDTO(salvo))
                        .collect(Collectors.toList()));
                dto.put("hitsOnEnemy", gamePlayer.getSalvos()
                        .stream()
                        .map(salvo -> makeHistoryDTO(salvo))
                        .collect(Collectors.toList()));
                dto.put("hitsOnUser", enemy.getSalvos()
                        .stream()
                        .map(salvo -> makeHistoryDTO(salvo))
                        .collect(Collectors.toList()));
                dto.put("enemySunkShips", getSunkShips(enemy.getShips()));
                dto.put("userSunkShips", getSunkShips(gamePlayer.getShips()));
                if (gamePlayer.getScore() == null) {
                    checkGameOver(gamePlayer,getLastTurn(gamePlayer), getLastTurn(getEnemyGamePlayer(gamePlayer)));
                } else {
                    dto.put("userScore", gamePlayer.getScore());
                }
                dto.put("gameState", makeGameStateDTO(gamePlayer));



            }
        } else {
            dto.put("error", "Not your game");
        }
        return dto;
    }
//------------------------ Methods ------------------------------------------------------------------------------------------------------

    private GamePlayer getEnemyGamePlayer(GamePlayer gamePlayer) {
        return gamePlayer.getGame().getGamePlayers()
                .stream()
                .filter(gp -> gp.getId() != gamePlayer.getId())
                .findFirst()
                .orElse(null);
    }

    private List<Object> getHitShips (Set<Ship> ships, Salvo salvo){
        List<Object> turnHistoric = new ArrayList<>();
        for(Ship ship : ships){
            Map<String, Object> dto = new LinkedHashMap<String, Object>();
            List<String> hitsOnShip = new ArrayList<>();
            for (String location : salvo.getLocations()) {
                if (ship.getLocation().contains(location))
                    hitsOnShip.add(location);
            }
            if (hitsOnShip.size() > 0) {
                dto.put("type", ship.getType());
                dto.put("hits", hitsOnShip);
                turnHistoric.add(dto);
            }
        }
        return turnHistoric;
    }

    private List<String> allHits (GamePlayer gamePlayer) {
        List<String> hits = new ArrayList<>();
        List<String> shipArray = shipLocations(getEnemyGamePlayer(gamePlayer));
        List<String> salvoArray = salvoLocations(gamePlayer);
        for (int i = 0; i < salvoArray.size(); ++i) {
            for (int j = 0; j < shipArray.size(); ++j) {
                if (salvoArray.get(i) == shipArray.get(j)) {
                    hits.add(salvoArray.get(i));
                }
            }
        }
        return hits;
    }

    private void sinkShips(Set<Ship> ships) {
        for (Ship ship : ships) {
            GamePlayer enemy = getEnemyGamePlayer(ship.getGamePlayer());
            if (allHits(enemy).containsAll(ship.getLocation()) && !ship.isSunk()) {
                ship.setSunk(true);
                shipRepository.save(ship);
            }
        }
    }

    private List<Object> getSunkShips (Set<Ship> ships){
        List<Object> array = new ArrayList<>();
        for (Ship ship : ships){
            GamePlayer enemy = getEnemyGamePlayer(ship.getGamePlayer());
            List<Object> hitOnTheShip = new ArrayList<>();
            List<Salvo> salvos = new ArrayList<>(enemy.getSalvos());
            salvos.sort(Comparator.comparingInt(Salvo::getTurn));
            for (Salvo salvo : salvos) {
                List<String> salvoLocations = salvo.getLocations();
                for (String location : salvoLocations) {
                    if (ship.getLocation().contains(location)) {
                        hitOnTheShip.add(location);
                    }
                }
                if(hitOnTheShip.containsAll(ship.getLocation())){
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("ship", ship.getType());
                    map.put("turn", salvo.getTurn());
                    array.add(map);
                    break;
                }

            }
        }
        return array;
    }

    private List<String> shipLocations (GamePlayer gamePlayer) {
        return gamePlayer.getShips()
                .stream()
                .flatMap(ship -> ship.getLocation().stream())
                .collect(Collectors.toList());
    }

    private List<String> salvoLocations (GamePlayer gamePlayer) {
        return gamePlayer.getSalvos()
                .stream()
                .flatMap(salvo -> salvo.getLocations().stream())
                .collect(Collectors.toList());
    }

    private int getLastTurn (GamePlayer gamePlayer) {
        int lastTurn = 0;
        for (Salvo salvo : gamePlayer.getSalvos()) {
            if (lastTurn < salvo.getTurn())
                lastTurn = salvo.getTurn();
        }
        return lastTurn;
    }

    private Player currentPlayer (Authentication authentication){
        return playerRepository.findByUserName(authentication.getName());
    }

    private List<Object> sunkShipsList(GamePlayer gamePlayer) {
        return gamePlayer.getShips()
                .stream()
                .filter(Ship::isSunk)
                .collect(Collectors.toList());
    }

    private boolean showTurn (GamePlayer gamePlayer) {
        GamePlayer opponent = getEnemyGamePlayer(gamePlayer);
        int userTurn = getLastTurn(gamePlayer);
        int opponentTurn = getLastTurn(opponent);
        boolean isUserTurn;
        if (userTurn > opponentTurn ) {
            isUserTurn = false;
        } else if  (userTurn < opponentTurn) {
            isUserTurn = true;
        } else {
            if (gamePlayer.getId() < opponent.getId()) {
                isUserTurn = true;
            }else {
                isUserTurn = false;
            }
        }
        return isUserTurn;
    }

    private void updateScores(GamePlayer gamePlayer) {
        GamePlayer enemy = getEnemyGamePlayer(gamePlayer);
        if (sunkShipsList(gamePlayer).size() != 5 && sunkShipsList(getEnemyGamePlayer(gamePlayer)).size() == 5) {
            scoreRepository.save(new Score(1.0, gamePlayer.getPlayer(), gamePlayer.getGame()));
        } else if (sunkShipsList(gamePlayer).size() == 5 && sunkShipsList(getEnemyGamePlayer(gamePlayer)).size() != 5) {
            scoreRepository.save(new Score(0.0, gamePlayer.getPlayer(), gamePlayer.getGame()));
        } else if (sunkShipsList(gamePlayer).size() == 5 && sunkShipsList(getEnemyGamePlayer(gamePlayer)).size() == 5){
            scoreRepository.save(new Score(0.5, gamePlayer.getPlayer(), gamePlayer.getGame()));
        }
    }

    private void checkGameOver(GamePlayer gamePlayer, Integer userTurn, Integer enemyTurn) {
        if (gameOver(gamePlayer, userTurn, enemyTurn)){
            updateScores(gamePlayer);
        }
    }

    private boolean gameOver (GamePlayer gamePlayer, Integer userTurn, Integer enemyTurn) {
        boolean gameOver = false;
        if (getEnemyGamePlayer(gamePlayer) != null && userTurn.equals(enemyTurn)) {
            if (sunkShipsList(gamePlayer).size() == 5 || sunkShipsList(getEnemyGamePlayer(gamePlayer)).size() == 5) {
                gameOver = true;
            }
        }
        return gameOver;
    }



    private String gameStatus (GamePlayer gamePlayer) {
        GamePlayer enemy = getEnemyGamePlayer(gamePlayer);
        String statusOfGame="";

        if (enemy == null){
            statusOfGame = "Looking for opponent";
        } else {
            boolean isGameOver = gameOver(gamePlayer, getLastTurn(gamePlayer), getLastTurn(getEnemyGamePlayer(gamePlayer)));
            if (gamePlayer.getShips().size() < 5){
                statusOfGame = "Placing Ships";
            }else if (enemy.getShips().size() <5){
                statusOfGame = "Waiting for enemy to place ships";
            }else {

            }
            if (gamePlayer.getShips().size() == 5 && enemy.getShips().size() == 5){
                if (showTurn(gamePlayer)){
                    statusOfGame = "Enter Salvo";
                }else {
                    statusOfGame = "Waiting for opponent's Salvo";
                }
                if (isGameOver){
                    gamePlayer.getGame().setOver(true);
                    if (sunkShipsList(gamePlayer).size() == 5 && sunkShipsList(enemy).size() == 5){
                        statusOfGame = "You tied";
                    }
                    else {
                        if (sunkShipsList(gamePlayer).size() == 5 && sunkShipsList(enemy).size() != 5){
                            statusOfGame = "You win";
                        }
                        if (sunkShipsList(gamePlayer).size() != 5 && sunkShipsList(enemy).size() == 5){
                            statusOfGame = "You Lose";
                        }
                    }
                }
            }
        }

        return statusOfGame;
    }
//---------- DTO's -----------------------------------------------------------------------------------------------------------

    private Map<String, Object> makeGameDTO(Game game) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("gameId", game.getId());
        dto.put("isGameOver", game.isOver());

        dto.put("creationDate", game.getCreated().toString());
        dto.put("gamePlayers", game.getGamePlayers()
                .stream()
                .map(gp -> makeGamePlayerDTO(gp))
                .collect(Collectors.toList()));
        return dto;
    }

    private Map<String, Object> makeSalvoDTO(Salvo salvo) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("turn", salvo.getTurn());
        dto.put("locations", salvo.getLocations());
        return dto;
    }

    private Map<String, Object> makeGameStateDTO (GamePlayer gamePlayer){
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("userTurn" , showTurn(gamePlayer));
        dto.put("gameOver", gameOver(gamePlayer, getLastTurn(gamePlayer), getLastTurn(getEnemyGamePlayer(gamePlayer))));
        return dto;
    }

    private Map<String, Object>  makeHistoryDTO (Salvo salvo) {
        GamePlayer enemy = getEnemyGamePlayer(salvo.getGamePlayer());
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("turn", salvo.getTurn());
        dto.put("events", getHitShips(enemy.getShips(), salvo));
        return dto;
    }

    private Map<String, Object> makeGamePlayerDTO(GamePlayer gamePlayer) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("gamePlayerId", gamePlayer.getId());
        dto.put("player", makePlayerDTO(gamePlayer.getPlayer()));
        return dto;
    }

    private Map<String, Object> makePlayerDTO (Player player){
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("playerId", player.getId());
        dto.put("userName", player.getUserName());
        return dto;
    }

    private Map <String, Object> makeShipDTO (Ship ship){
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("type", ship.getType());
        dto.put("locations", ship.getLocation());
        return dto;
    }

    private Map<String, Object> makeMap(String key, Object value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }
}



