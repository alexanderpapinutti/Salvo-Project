package com.codeoftheweb.Salvo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


@RepositoryRestResource
public interface GamePlayerRepository extends JpaRepository<GamePlayer, Long> {
    Game findGamePlayerById(@Param("id") Long id);
}