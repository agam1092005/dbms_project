USE football_management_system;

DELIMITER $$

CREATE TRIGGER prevent_null_team
BEFORE INSERT ON Player
FOR EACH ROW
BEGIN
  IF NEW.teamid IS NULL THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Cannot insert a player without assigning a team!';
  END IF;
END$$

-- Log triggers for Team table
CREATE TRIGGER log_team_insert
AFTER INSERT ON Team
FOR EACH ROW
BEGIN
  INSERT INTO OperationLog(operation_type, details)
  VALUES ('INSERT_TEAM', CONCAT('Added team: "', NEW.team_name, '"'));
END$$

CREATE TRIGGER log_team_delete
AFTER DELETE ON Team
FOR EACH ROW
BEGIN
  INSERT INTO OperationLog(operation_type, details)
  VALUES ('DELETE_TEAM', CONCAT('Deleted team: "', OLD.team_name, '"'));
END$$

-- Log triggers for Player table
DROP TRIGGER IF EXISTS log_player_insert;
CREATE TRIGGER log_player_insert
AFTER INSERT ON Player
FOR EACH ROW
BEGIN
  DECLARE team_name VARCHAR(100);
  SELECT team_name INTO team_name FROM Team WHERE teamid = NEW.teamid;
  IF team_name IS NULL THEN
    SET team_name = CONCAT('ID: ', NEW.teamid);
  END IF;
  INSERT INTO OperationLog(operation_type, details)
  VALUES ('INSERT_PLAYER', CONCAT('Added player: "', NEW.fullname, '" to team: "', team_name, '"'));
END$$

DROP TRIGGER IF EXISTS log_player_delete;
CREATE TRIGGER log_player_delete
AFTER DELETE ON Player
FOR EACH ROW
BEGIN
  DECLARE team_name VARCHAR(100);
  SELECT team_name INTO team_name FROM Team WHERE teamid = OLD.teamid;
  IF team_name IS NULL THEN
    SET team_name = CONCAT('ID: ', OLD.teamid);
  END IF;
  INSERT INTO OperationLog(operation_type, details)
  VALUES ('DELETE_PLAYER', CONCAT('Deleted player: "', OLD.fullname, '" from team: "', team_name, '"'));
END$$

-- Log triggers for Manager table
DROP TRIGGER IF EXISTS log_manager_insert;
CREATE TRIGGER log_manager_insert
AFTER INSERT ON Manager
FOR EACH ROW
BEGIN
  DECLARE team_name VARCHAR(100);
  SELECT team_name INTO team_name FROM Team WHERE teamid = NEW.teamid;
  IF team_name IS NULL THEN
    SET team_name = CONCAT('ID: ', NEW.teamid);
  END IF;
  INSERT INTO OperationLog(operation_type, details)
  VALUES ('INSERT_MANAGER', CONCAT('Added manager: "', NEW.fullname, '" to team: "', team_name, '"'));
END$$

CREATE TRIGGER log_manager_delete
AFTER DELETE ON Manager
FOR EACH ROW
BEGIN
  DECLARE team_name VARCHAR(100);
  SELECT team_name INTO team_name FROM Team WHERE teamid = OLD.teamid;
  INSERT INTO OperationLog(operation_type, details)
  VALUES ('DELETE_MANAGER', CONCAT('Deleted manager: "', OLD.fullname, '" from team: "', team_name, '"'));
END$$

-- Log triggers for Stadium table
CREATE TRIGGER log_stadium_insert
AFTER INSERT ON Stadium
FOR EACH ROW
BEGIN
  INSERT INTO OperationLog(operation_type, details)
  VALUES ('INSERT_STADIUM', CONCAT('Added stadium: "', NEW.stadium_name, '" in city: "', NEW.city, '"'));
END$$

CREATE TRIGGER log_stadium_delete
AFTER DELETE ON Stadium
FOR EACH ROW
BEGIN
  INSERT INTO OperationLog(operation_type, details)
  VALUES ('DELETE_STADIUM', CONCAT('Deleted stadium: "', OLD.stadium_name, '" in city: "', OLD.city, '"'));
END$$

-- Log triggers for Matches table
DROP TRIGGER IF EXISTS log_match_insert;
CREATE TRIGGER log_match_insert
AFTER INSERT ON Matches
FOR EACH ROW
BEGIN
  DECLARE team1_name VARCHAR(100);
  DECLARE team2_name VARCHAR(100);
  DECLARE stadium_name VARCHAR(100);

  SELECT team_name INTO team1_name FROM Team WHERE teamid = NEW.team1id;
  IF team1_name IS NULL THEN
    SET team1_name = CONCAT('ID: ', NEW.team1id);
  END IF;

  SELECT team_name INTO team2_name FROM Team WHERE teamid = NEW.team2id;
  IF team2_name IS NULL THEN
    SET team2_name = CONCAT('ID: ', NEW.team2id);
  END IF;

  SELECT stadium_name INTO stadium_name FROM Stadium WHERE stadiumid = NEW.stadiumid;
  IF stadium_name IS NULL THEN
    SET stadium_name = CONCAT('ID: ', NEW.stadiumid);
  END IF;

  INSERT INTO OperationLog(operation_type, details)
  VALUES ('INSERT_MATCH', CONCAT('Added match: "', team1_name, ' vs ', team2_name, '" at "', stadium_name, '" on ', NEW.match_date));
END$$

CREATE TRIGGER log_match_delete
AFTER DELETE ON Matches
FOR EACH ROW
BEGIN
  DECLARE team1_name VARCHAR(100);
  DECLARE team2_name VARCHAR(100);
  DECLARE stadium_name VARCHAR(100);
  
  SELECT team_name INTO team1_name FROM Team WHERE teamid = OLD.team1id;
  SELECT team_name INTO team2_name FROM Team WHERE teamid = OLD.team2id;
  SELECT stadium_name INTO stadium_name FROM Stadium WHERE stadiumid = OLD.stadiumid;
  
  INSERT INTO OperationLog(operation_type, details)
  VALUES ('DELETE_MATCH', CONCAT('Deleted match: "', team1_name, ' vs ', team2_name, '" at "', stadium_name, '" on ', OLD.match_date));
END$$

-- Log triggers for Goal table
CREATE TRIGGER log_goal_insert
AFTER INSERT ON Goal
FOR EACH ROW
BEGIN
  DECLARE player_name VARCHAR(100);
  DECLARE team_name VARCHAR(100);
  DECLARE match_date DATE;
  
  SELECT p.fullname, t.team_name, m.match_date 
  INTO player_name, team_name, match_date
  FROM Player p
  JOIN Team t ON p.teamid = t.teamid
  JOIN Matches m ON NEW.matchid = m.matchid
  WHERE p.playerid = NEW.playerid;
  
  INSERT INTO OperationLog(operation_type, details)
  VALUES ('INSERT_GOAL', CONCAT('Added goal: "', player_name, '" (', team_name, ') scored at minute ', NEW.time_minute, ' on ', match_date));
END$$

CREATE TRIGGER log_goal_delete
AFTER DELETE ON Goal
FOR EACH ROW
BEGIN
  DECLARE player_name VARCHAR(100);
  DECLARE team_name VARCHAR(100);
  DECLARE match_date DATE;
  
  SELECT p.fullname, t.team_name, m.match_date 
  INTO player_name, team_name, match_date
  FROM Player p
  JOIN Team t ON p.teamid = t.teamid
  JOIN Matches m ON OLD.matchid = m.matchid
  WHERE p.playerid = OLD.playerid;
  
  INSERT INTO OperationLog(operation_type, details)
  VALUES ('DELETE_GOAL', CONCAT('Deleted goal: "', player_name, '" (', team_name, ') scored at minute ', OLD.time_minute, ' on ', match_date));
END$$

-- Prevent adding more than 11 players to a team
DROP TRIGGER IF EXISTS prevent_more_than_11_players;
CREATE TRIGGER prevent_more_than_11_players
BEFORE INSERT ON Player
FOR EACH ROW
BEGIN
  DECLARE player_count INT;
  SELECT COUNT(*) INTO player_count FROM Player WHERE teamid = NEW.teamid;
  IF player_count >= 11 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot add more than 11 players to a team!';
  END IF;
END$$

-- Prevent creating a match if either team does not have a manager
DROP TRIGGER IF EXISTS prevent_match_without_manager;
CREATE TRIGGER prevent_match_without_manager
BEFORE INSERT ON Matches
FOR EACH ROW
BEGIN
  DECLARE manager1 INT;
  DECLARE manager2 INT;
  SELECT COUNT(*) INTO manager1 FROM Manager WHERE teamid = NEW.team1id;
  SELECT COUNT(*) INTO manager2 FROM Manager WHERE teamid = NEW.team2id;
  IF manager1 = 0 OR manager2 = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Both teams must have a manager to start a match!';
  END IF;
END$$

-- Prevent creating a match if either team does not have exactly 11 players
DROP TRIGGER IF EXISTS prevent_match_without_11_players;
CREATE TRIGGER prevent_match_without_11_players
BEFORE INSERT ON Matches
FOR EACH ROW
BEGIN
  DECLARE count1 INT;
  DECLARE count2 INT;
  SELECT COUNT(*) INTO count1 FROM Player WHERE teamid = NEW.team1id;
  SELECT COUNT(*) INTO count2 FROM Player WHERE teamid = NEW.team2id;
  IF count1 <> 11 OR count2 <> 11 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Both teams must have exactly 11 players to start a match!';
  END IF;
END$$

DELIMITER ;
