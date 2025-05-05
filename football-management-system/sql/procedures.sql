USE football_management_system;

DELIMITER $$

-- ========================= PLAYER =========================
CREATE PROCEDURE AddPlayer(
  IN p_fullname VARCHAR(100),
  IN p_nationality VARCHAR(50),
  IN p_teamid INT
)
BEGIN
  DECLARE team_exists INT DEFAULT 0;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION 
  BEGIN
    ROLLBACK;
    SELECT 'Error occurred while adding player.' AS ErrorMessage;
  END;

  START TRANSACTION;

  SELECT COUNT(*) INTO team_exists
  FROM Team
  WHERE teamid = p_teamid;

  IF team_exists = 0 THEN
    ROLLBACK;
    SELECT 'Error: Team ID does not exist!' AS ErrorMessage;
  ELSE
    INSERT INTO Player (fullname, nationality, teamid)
    VALUES (p_fullname, p_nationality, p_teamid);
    
    COMMIT;
    SELECT 'Player added successfully.' AS SuccessMessage;
  END IF;
END$$

CREATE PROCEDURE DeletePlayer(
  IN p_playerid INT
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SELECT 'Error occurred while deleting player.' AS ErrorMessage;
  END;

  START TRANSACTION;

  DELETE FROM Player WHERE playerid = p_playerid;

  COMMIT;
  SELECT 'Player deleted successfully.' AS SuccessMessage;
END$$

-- ========================= TEAM =========================
CREATE PROCEDURE AddTeam(
  IN p_team_name VARCHAR(100)
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SELECT 'Error occurred while adding team.' AS ErrorMessage;
  END;

  START TRANSACTION;

  INSERT INTO Team(team_name)
  VALUES (p_team_name);

  COMMIT;
  SELECT 'Team added successfully.' AS SuccessMessage;
END$$

CREATE PROCEDURE DeleteTeam(
  IN p_teamid INT
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SELECT 'Error occurred while deleting team.' AS ErrorMessage;
  END;

  START TRANSACTION;

  DELETE FROM Team WHERE teamid = p_teamid;

  COMMIT;
  SELECT 'Team deleted successfully.' AS SuccessMessage;
END$$

-- ========================= MANAGER =========================
CREATE PROCEDURE AddManager(
  IN p_fullname VARCHAR(100)
)
BEGIN
  DECLARE team_exists INT DEFAULT 0;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SELECT 'Error occurred while adding manager.' AS ErrorMessage;
  END;

  START TRANSACTION;

  INSERT INTO Manager(fullname)
  VALUES (p_fullname);

  COMMIT;
  SELECT 'Manager added successfully.' AS SuccessMessage;
END$$

CREATE PROCEDURE DeleteManager(
  IN p_managerid INT
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SELECT 'Error occurred while deleting manager.' AS ErrorMessage;
  END;

  START TRANSACTION;

  DELETE FROM Manager WHERE managerid = p_managerid;

  COMMIT;
  SELECT 'Manager deleted successfully.' AS SuccessMessage;
END$$

-- ========================= STADIUM =========================
CREATE PROCEDURE AddStadium(
  IN p_stadium_name VARCHAR(100),
  IN p_city VARCHAR(100)
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SELECT 'Error occurred while adding stadium.' AS ErrorMessage;
  END;

  START TRANSACTION;

  INSERT INTO Stadium(stadium_name, city)
  VALUES (p_stadium_name, p_city);

  COMMIT;
  SELECT 'Stadium added successfully.' AS SuccessMessage;
END$$

CREATE PROCEDURE DeleteStadium(
  IN p_stadiumid INT
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SELECT 'Error occurred while deleting stadium.' AS ErrorMessage;
  END;

  START TRANSACTION;

  DELETE FROM Stadium WHERE stadiumid = p_stadiumid;

  COMMIT;
  SELECT 'Stadium deleted successfully.' AS SuccessMessage;
END$$

-- ========================= MATCH =========================
CREATE PROCEDURE AddMatch(
  IN p_matchid INT,
  IN p_match_date DATE,
  IN p_team1id INT,
  IN p_team2id INT,
  IN p_stadiumid INT
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SELECT 'Error occurred while adding match.' AS ErrorMessage;
  END;

  START TRANSACTION;

  INSERT INTO Matches(matchid, match_date, team1id, team2id, stadiumid)
  VALUES (p_matchid, p_match_date, p_team1id, p_team2id, p_stadiumid);

  COMMIT;
  SELECT 'Match added successfully.' AS SuccessMessage;
END$$

CREATE PROCEDURE DeleteMatch(
  IN p_matchid INT
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SELECT 'Error occurred while deleting match.' AS ErrorMessage;
  END;

  START TRANSACTION;

  DELETE FROM Matches WHERE matchid = p_matchid;

  COMMIT;
  SELECT 'Match deleted successfully.' AS SuccessMessage;
END$$

-- ========================= GOAL =========================
CREATE PROCEDURE AddGoal(
  IN p_goalid INT,
  IN p_playerid INT,
  IN p_matchid INT,
  IN p_time_minute INT
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SELECT 'Error occurred while adding goal.' AS ErrorMessage;
  END;

  START TRANSACTION;

  INSERT INTO Goal(goalid, playerid, matchid, time_minute)
  VALUES (p_goalid, p_playerid, p_matchid, p_time_minute);

  COMMIT;
  SELECT 'Goal added successfully.' AS SuccessMessage;
END$$

CREATE PROCEDURE DeleteGoal(
  IN p_goalid INT
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SELECT 'Error occurred while deleting goal.' AS ErrorMessage;
  END;

  START TRANSACTION;

  DELETE FROM Goal WHERE goalid = p_goalid;

  COMMIT;
  SELECT 'Goal deleted successfully.' AS SuccessMessage;
END$$

DELIMITER ;
