package com.codeoftheweb.Salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

import static java.util.stream.Collectors.toList;

@Entity
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;
    private String userName;

    @OneToMany(mappedBy = "player", fetch=FetchType.EAGER)
    Set<GamePlayer> gamePlayers;


    public void addGamePlayer(GamePlayer gamePlayer){
        gamePlayer.setPlayer(this);
        gamePlayers.add(gamePlayer);
    }

    @JsonIgnore
    public List<Game> getGames() {

        return gamePlayers.stream().map(sub -> sub.getGame()).collect(toList());
    }


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Player() { }

    public Player(String userName) {
        this.userName = userName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String toString() {
        return userName + " " + id;
    }

    @JsonIgnore
    public Set<GamePlayer> getGamePlayers() {
        return gamePlayers;
    }


    public void setGamePlayers(Set<GamePlayer> gamePlayers) {
        this.gamePlayers = gamePlayers;
    }
}


