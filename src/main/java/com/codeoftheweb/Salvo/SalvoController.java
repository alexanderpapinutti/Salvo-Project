package com.codeoftheweb.Salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
            return new ResponseEntity<>(makeMap("error", "Can't create game"), HttpStatus.UNAUTHORIZED);
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
            return new ResponseEntity<>(makeMap("error", "Ships have been placed already")
                    , HttpStatus.FORBIDDEN);
        } else if (ships.isEmpty()) {
            return new ResponseEntity<>(makeMap("error", "Missing Ships")
                    , HttpStatus.FORBIDDEN);
        }else{
            for (Ship ship : ships) {
                ship.setGamePlayer(gamePlayer);
                shipRepository.save(ship);
            }
            return new ResponseEntity<>(makeMap("success", "Ships are created")
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
            if (enemy != null) {
                dto.put("enemyInfo", enemy.getPlayer());
                dto.put("enemySalvos", enemy.getSalvos()
                        .stream()
                        .map(salvo -> makeSalvoDTO(salvo))
                        .collect(Collectors.toList()));
            }
        } else {
            dto.put("error", "Not your game");

//            return new ResponseEntity<Map<String, Object>>(makeMap("error", "Not your game"), HttpStatus.FORBIDDEN);
        }
        return dto;
    }

    private Map<String, Object> makeGameDTO(Game game) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("gameId", game.getId());
        dto.put("creationDate", game.getCreated().toString());
        dto.put("gamePlayers", game.getGamePlayers()
                .stream()
                .map(gamePlayer -> makeGamePlayerDTO(gamePlayer))
                .collect(Collectors.toList()));
        return dto;
    }

    private Map<String, Object> makeSalvoDTO(Salvo salvo) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("turn", salvo.getTurn());
        dto.put("locations", salvo.getLocations());
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

    private GamePlayer getEnemyGamePlayer(GamePlayer gamePlayer) {
        return gamePlayer.getGame().getGamePlayers()
                .stream()
                .filter(gp -> gp.getId() != gamePlayer.getId())
                .findFirst()
                .orElse(null);
    }

    private Map<String, Object> makeMap(String key, Object value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }

    private Player currentPlayer (Authentication authentication){
        return (Player) playerRepository.findByUserName(authentication.getName());
    }
}



