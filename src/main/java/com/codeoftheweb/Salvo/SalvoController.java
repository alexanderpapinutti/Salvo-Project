package com.codeoftheweb.Salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api")
public class SalvoController {

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

    @RequestMapping("/games")
    public List <Object> getAllGames() {
        return gameRepository.findAll()
                .stream()
                .map(game -> makeGameDTO(game)).collect(Collectors.toList());
    }

    @RequestMapping("/players")
    public List <Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    @RequestMapping("/gamePlayers")
    public List <GamePlayer> getAllGamePlayers() {
        return gamePlayerRepository.findAll();
    }

    @RequestMapping(value = "/game_view/{id}")
    public Map<String,Object> getURLById (@PathVariable Long id) {
        GamePlayer gamePlayer = gamePlayerRepository.findOne(id);
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("game", makeGameDTO(gamePlayer.getGame()));
        dto.put("userInfo", makeGamePlayerDTO(gamePlayer));
        dto.put("userShips", gamePlayer.getShips()
        .stream().map(ship -> makeShipDTO(ship))
        .collect(Collectors.toList()));
        dto.put("userSalvos", gamePlayer.getSalvos()
                .stream()
                .map(salvo -> makeSalvoDTO(salvo))
                .collect(Collectors.toList()));
        return dto;
    }

    private Map<String, Object> makeGameDTO(Game game) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", game.getId());
        dto.put("created", game.getCreated().toString());
        dto.put("gamePlayers", game.getGamePlayers()
                .stream()
                .map(gamePlayer -> makeGamePlayerDTO(gamePlayer))
                .collect(Collectors.toList()));
        return dto;
    }

    private Map<String, Object> makeSalvoDTO(Salvo salvo) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("turn", salvo.getTurn());
        dto.put("cell", salvo.getSalvoHits());
        return dto;
    }

    private Map<String, Object> makeGamePlayerDTO(GamePlayer gamePlayer) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", gamePlayer.getId());
        dto.put("player", makePlayerDTO(gamePlayer.getPlayer()));
        return dto;
    }

    private Map<String, Object> makePlayerDTO (Player player){
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", player.getId());
        dto.put("email", player.getUserName());
        return dto;
    }

    private Map <String, Object> makeShipDTO (Ship ship){
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("type", ship.getType());
        dto.put("locations", ship.getLocation());
        return dto;
    }

}
