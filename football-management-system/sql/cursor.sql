USE football_management_system;

DELIMITER $$

-- Player Goal Summary Cursor
CREATE PROCEDURE CursorPlayerGoals()
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE p_id INT;
  DECLARE p_name VARCHAR(100);
  DECLARE goal_count INT;

  DECLARE player_cursor CURSOR FOR
    SELECT playerid, fullname FROM Player;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  CREATE TEMPORARY TABLE IF NOT EXISTS PlayerGoalSummary (
    playerid INT,
    player_name VARCHAR(100),
    total_goals INT
  );

  OPEN player_cursor;

  read_loop: LOOP
    FETCH player_cursor INTO p_id, p_name;

    IF done THEN
      LEAVE read_loop;
    END IF;

    SELECT COUNT(*) INTO goal_count
    FROM Goal
    WHERE playerid = p_id;

    INSERT INTO PlayerGoalSummary (playerid, player_name, total_goals)
    VALUES (p_id, p_name, goal_count);
  END LOOP;

  CLOSE player_cursor;

  SELECT * FROM PlayerGoalSummary;
END$$

-- Team Player Count Cursor
CREATE PROCEDURE CursorTeamPlayers()
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE t_id INT;
  DECLARE t_name VARCHAR(100);
  DECLARE count_players INT;

  DECLARE team_cursor CURSOR FOR
    SELECT teamid, team_name FROM Team;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  CREATE TEMPORARY TABLE IF NOT EXISTS TeamPlayerSummary (
    teamid INT,
    team_name VARCHAR(100),
    total_players INT
  );

  OPEN team_cursor;

  read_loop: LOOP
    FETCH team_cursor INTO t_id, t_name;

    IF done THEN
      LEAVE read_loop;
    END IF;

    SELECT COUNT(*) INTO count_players
    FROM Player
    WHERE teamid = t_id;

    INSERT INTO TeamPlayerSummary (teamid, team_name, total_players)
    VALUES (t_id, t_name, count_players);
  END LOOP;

  CLOSE team_cursor;

  SELECT * FROM TeamPlayerSummary;
END$$

-- Stadium Match Count Cursor
CREATE PROCEDURE CursorStadiumMatches()
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE s_id INT;
  DECLARE s_name VARCHAR(100);
  DECLARE match_count INT;

  DECLARE stadium_cursor CURSOR FOR
    SELECT stadiumid, stadium_name FROM Stadium;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  CREATE TEMPORARY TABLE IF NOT EXISTS StadiumMatchSummary (
    stadiumid INT,
    stadium_name VARCHAR(100),
    total_matches INT
  );

  OPEN stadium_cursor;

  read_loop: LOOP
    FETCH stadium_cursor INTO s_id, s_name;

    IF done THEN
      LEAVE read_loop;
    END IF;

    SELECT COUNT(*) INTO match_count
    FROM Matches
    WHERE stadiumid = s_id;

    INSERT INTO StadiumMatchSummary (stadiumid, stadium_name, total_matches)
    VALUES (s_id, s_name, match_count);
  END LOOP;

  CLOSE stadium_cursor;

  SELECT * FROM StadiumMatchSummary;
END$$

DELIMITER ;
