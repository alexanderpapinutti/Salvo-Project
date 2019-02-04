package com.codeoftheweb.Salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class, args);
	}


	@Bean
	public PasswordEncoder passwordEncoder() {
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}
	@Bean
	public CommandLineRunner initData(PlayerRepository playerRepository,
									  GameRepository gameRepository,
									  GamePlayerRepository gamePlayerRepository,
									  ShipRepository shipRepository,
									  SalvoRepository salvoRepository,
									  ScoreRepository scoreRepository) {
		return (args) -> {

			Player player1= new Player("j.bauer@ctu.gov","123");
			Player player2= new Player("c.obrian@ctu.gov","123");
			Player player3= new Player("t.almeida@ctu.gov","123");
			Player player4= new Player("kim_bauer@gmail.com","123");

			playerRepository.save(player1);
			playerRepository.save(player2);
			playerRepository.save(player3);
			playerRepository.save(player4);

			Date date = new Date();
			Date date1 = Date.from(date.toInstant());
			Date finishDate =  Date.from(date.toInstant().plusSeconds(1800));
			Date date2 = Date.from(date.toInstant().plusSeconds(3600));
			Date finishDate1 =  Date.from(date.toInstant().plusSeconds(7000));
			Date date3 = Date.from(date.toInstant().plusSeconds(7200));
			Date finishDate2 =  Date.from(date.toInstant().plusSeconds(10000));
			Date date4 = Date.from(date.toInstant().plusSeconds(10800));
			Date finishDate3 =  Date.from(date.toInstant().plusSeconds(12000));
			Date date5 = Date.from(date.toInstant().plusSeconds(14400));
			Date finishDate4 =  Date.from(date.toInstant().plusSeconds(16000));
			Date date6 = Date.from(date.toInstant().plusSeconds(18000));
			Date date7 = Date.from(date.toInstant().plusSeconds(21600));



			Game game1 = new Game( date1);
			Game game2 = new Game(date2);
			Game game3 = new Game(date3);
			Game game4 = new Game(date4);
			Game game5 = new Game(date5);
			Game game6 = new Game(date6);

			gameRepository.save(game1);
			gameRepository.save(game2);
			gameRepository.save(game3);
			gameRepository.save(game4);
			gameRepository.save(game5);
			gameRepository.save(game6);

			GamePlayer gamePlayer1 = new GamePlayer(player1, game1);
			GamePlayer gamePlayer2 = new GamePlayer(player2, game1);
			GamePlayer gamePlayer3 = new GamePlayer(player1, game2);
			GamePlayer gamePlayer4 = new GamePlayer(player2, game2);
			GamePlayer gamePlayer5 = new GamePlayer(player2, game3);
			GamePlayer gamePlayer6 = new GamePlayer(player3, game3);
			GamePlayer gamePlayer7 = new GamePlayer(player1, game4);
			GamePlayer gamePlayer8 = new GamePlayer(player2, game4);
			GamePlayer gamePlayer9 = new GamePlayer(player3, game5);
			GamePlayer gamePlayer10 = new GamePlayer(player1, game5);
			GamePlayer gamePlayer11 = new GamePlayer(player4, game6);
			GamePlayer gamePlayer12 = new GamePlayer(player3, game6);

			gamePlayerRepository.save(gamePlayer1);
			gamePlayerRepository.save(gamePlayer2);
			gamePlayerRepository.save(gamePlayer3);
			gamePlayerRepository.save(gamePlayer4);
			gamePlayerRepository.save(gamePlayer5);
			gamePlayerRepository.save(gamePlayer6);
			gamePlayerRepository.save(gamePlayer7);
			gamePlayerRepository.save(gamePlayer8);
			gamePlayerRepository.save(gamePlayer9);
			gamePlayerRepository.save(gamePlayer10);
			gamePlayerRepository.save(gamePlayer11);
//			gamePlayerRepository.save(gamePlayer12);

			List<String> location1 = Arrays.asList("F1","G1","H1","I1","J1");
			List<String> location2 = Arrays.asList("G2","H2","I2","J2");
			List<String> location3 = Arrays.asList("H3","I3","J3");
			List<String> location4 = Arrays.asList("H4","I4","J4");
			List<String> location5 = Arrays.asList("J5","I5");
//			List<String> location6 = Arrays.asList("B5","C5","D5");
//			List<String> location7 = Arrays.asList("C6","C7");
//			List<String> location8 = Arrays.asList("A2","A3","A4");
//			List<String> location9 = Arrays.asList("G6", "H6");
//			List<String> location10 = Arrays.asList("B5","C5","D5");
//			List<String> location11 = Arrays.asList("C6","C7");
//			List<String> location12 = Arrays.asList("A2","A3","A4");
//			List<String> location13 = Arrays.asList("G6", "H6");
//			List<String> location14 = Arrays.asList("B5","C5","D5");
//			List<String> location15 = Arrays.asList("C6","C7");
//			List<String> location16 = Arrays.asList("A2","A3","A4");
//			List<String> location17 = Arrays.asList("G6","H6");
//			List<String> location18 = Arrays.asList("B5","C5","D5");
//			List<String> location19 = Arrays.asList("C6","C7");
//			List<String> location20 = Arrays.asList("A2","A3","A4");
//			List<String> location21 = Arrays.asList("G6","H6");
//			List<String> location22 = Arrays.asList("B5","C5","D5");
//			List<String> location23 = Arrays.asList("C6", "C7");
//			List<String> location24 = Arrays.asList("B5", "C5","D5");
//			List<String> location25 = Arrays.asList("C6","C7");
//			List<String> location26 = Arrays.asList("A2","A3","A4");
//			List<String> location27 = Arrays.asList("G6","H6");
//
			Ship ship1 = new Ship(gamePlayer1,"Destroyer", location3);
			Ship ship2 = new Ship(gamePlayer1,"Submarine", location4);
			Ship ship3 = new Ship(gamePlayer1,"Patrol-Boat", location5);
			Ship ship4 = new Ship(gamePlayer1,"Aircraft-Carrier", location1);
			Ship ship5 = new Ship(gamePlayer1,"Battleship", location2);
//			Ship ship4 = new Ship(gamePlayer2,"Destroyer", location4);
//			Ship ship5 = new Ship(gamePlayer2,"Patrol-Boat", location5);
//			Ship ship6 = new Ship(gamePlayer3,"Destroyer", location6);
//			Ship ship7 = new Ship(gamePlayer3,"Patrol-Boat", location7);
//			Ship ship8 = new Ship(gamePlayer4,"Submarine", location8);
//			Ship ship9 = new Ship(gamePlayer4,"Patrol-Boat", location9);
//			Ship ship10 = new Ship(gamePlayer4,"Destroyer", location10);
//			Ship ship11 = new Ship(gamePlayer4,"Patrol-Boat", location11);
//			Ship ship12 = new Ship(gamePlayer5,"Submarine", location12);
//			Ship ship13 = new Ship(gamePlayer5,"Patrol-Boat", location13);
//			Ship ship14 = new Ship(gamePlayer6,"Destroyer", location14);
//			Ship ship15 = new Ship(gamePlayer6,"Patrol-Boat", location15);
//			Ship ship16 = new Ship(gamePlayer6,"Submarine", location16);
//			Ship ship17 = new Ship(gamePlayer6,"Patrol-Boat", location17);
//			Ship ship18 = new Ship(gamePlayer7,"Destroyer", location18);
//			Ship ship19 = new Ship(gamePlayer7,"Patrol-Boat", location19);
//			Ship ship20 = new Ship(gamePlayer8,"Submarine", location20);
//			Ship ship21 = new Ship(gamePlayer8,"Patrol-Boat", location21);
//			Ship ship22 = new Ship(gamePlayer9,"Destroyer", location22);
//			Ship ship23 = new Ship(gamePlayer9,"Patrol-Boat", location23);
//			Ship ship24 = new Ship(gamePlayer9,"Destroyer", location24);
//			Ship ship25 = new Ship(gamePlayer9,"Patrol-Boat", location25);
//			Ship ship26 = new Ship(gamePlayer10,"Patrol-Boat", location26);
//			Ship ship27 = new Ship(gamePlayer10,"Patrol-Boat", location27);
//
			shipRepository.save(ship1);
			shipRepository.save(ship2);
			shipRepository.save(ship3);
			shipRepository.save(ship4);
			shipRepository.save(ship5);
//			shipRepository.save(ship6);
//			shipRepository.save(ship7);
//			shipRepository.save(ship8);
//			shipRepository.save(ship9);
//			shipRepository.save(ship10);
//			shipRepository.save(ship11);
//			shipRepository.save(ship12);
//			shipRepository.save(ship13);
//			shipRepository.save(ship14);
//			shipRepository.save(ship15);
//			shipRepository.save(ship16);
//			shipRepository.save(ship17);
//			shipRepository.save(ship18);
//			shipRepository.save(ship19);
//			shipRepository.save(ship20);
//			shipRepository.save(ship21);
//			shipRepository.save(ship22);
//			shipRepository.save(ship23);
//			shipRepository.save(ship24);
//			shipRepository.save(ship25);
//			shipRepository.save(ship26);
//			shipRepository.save(ship27);
//
//			List<String> p1r1 = Arrays.asList("B5","C5","F1");
			List<String> p2r1 = Arrays.asList("H1","I1","J1");
//			List<String> p1r2 = Arrays.asList("F2","D5");
			List<String> p2r2 = Arrays.asList("F10","H10","A1");
//			List<String> p1r3 = Arrays.asList("F3","D1","J10");
			List<String> p2r3 = Arrays.asList("F1","G1");
//
//			Salvo shotp1r1 = new Salvo(1, gamePlayer1, p1r1);
			Salvo shotp2r1 = new Salvo(1, gamePlayer2, p2r1);
//			Salvo shotp1r2 = new Salvo(2, gamePlayer1, p1r2);
			Salvo shotp2r2 = new Salvo(2, gamePlayer2, p2r2);
//			Salvo shotp1r3 = new Salvo(3, gamePlayer1, p1r3);
			Salvo shotp2r3 = new Salvo(3, gamePlayer2, p2r3);
//
//			salvoRepository.save(shotp1r1);
			salvoRepository.save(shotp2r1);
//			salvoRepository.save(shotp1r2);
			salvoRepository.save(shotp2r2);
//			salvoRepository.save(shotp1r3);
			salvoRepository.save(shotp2r3);

			Score score1 = new Score(1, finishDate, player1, game1);
			Score score2 = new Score(0, finishDate, player2, game1);
			Score score3 = new Score(1, finishDate1, player1, game2);
			Score score4 = new Score(0, finishDate1, player2, game2);
			Score score5 = new Score(0.5, finishDate2, player2, game3);
			Score score6 = new Score(0.5, finishDate2, player3, game3);
			Score score7 = new Score(0, finishDate3, player1, game4);
			Score score8 = new Score(1, finishDate3, player2, game4);
			Score score9 = new Score(1, finishDate4, player4, game6);
			Score score10 = new Score(0, finishDate4, player3, game6);

			scoreRepository.save(score1);
			scoreRepository.save(score2);
			scoreRepository.save(score3);
			scoreRepository.save(score4);
			scoreRepository.save(score5);
			scoreRepository.save(score6);
			scoreRepository.save(score7);
			scoreRepository.save(score8);
			scoreRepository.save(score9);
			scoreRepository.save(score10);
		};
	}
}

@Configuration
class WebSecurityConfiguration extends GlobalAuthenticationConfigurerAdapter {

	@Autowired
	PlayerRepository playerRepository;

	@Override
	public void init(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(inputName-> {
			Player player = playerRepository.findByUserName(inputName);
			if (player != null) {
				return new User(player.getUserName(), player.getPassword(),
						AuthorityUtils.createAuthorityList("USER"));
			} else {
				throw new UsernameNotFoundException("Unknown user: " + inputName);
			}
		});
	}
}

@EnableWebSecurity
@Configuration
class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.authorizeRequests()
				.antMatchers("/web/**").permitAll()
				.antMatchers("/api/games").permitAll()
				.antMatchers("/api/login").permitAll()
				.antMatchers("/api/players").permitAll()
				.antMatchers("/api/leaderBoard").permitAll()
				.antMatchers("/rest").denyAll()
				.anyRequest().fullyAuthenticated()
				.and()
				.formLogin();

		http.formLogin()
				.usernameParameter("userName")
				.passwordParameter("password")
				.loginPage("/api/login");

		http.logout().logoutUrl("/api/logout");

		// turn off checking for CSRF tokens
		http.csrf().disable();

		// if user is not authenticated, just send an authentication failure response
		http.exceptionHandling().authenticationEntryPoint((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

		// if login is successful, just clear the flags asking for authentication
		http.formLogin().successHandler((req, res, auth) -> clearAuthenticationAttributes(req));

		// if login fails, just send an authentication failure response
		http.formLogin().failureHandler((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

		// if logout is successful, just send a success response
		http.logout().logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler());
	}

	private void clearAuthenticationAttributes(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		if (session != null) {
			session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
		}

	}
}