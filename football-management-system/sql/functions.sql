USE football_management_system;

DELIMITER $$

-- Get total goals scored by a player
CREATE FUNCTION GetPlayerGoals(p_playerid INT)
RETURNS INT
DETERMINISTIC
BEGIN
  DECLARE total INT DEFAULT 0;

  SELECT COUNT(goalid)
  INTO total
  FROM Goal
  WHERE playerid = p_playerid;

  RETURN total;
END$$

-- Get total players in a team
CREATE FUNCTION GetTeamPlayerCount(p_teamid INT)
RETURNS INT
DETERMINISTIC
BEGIN
  DECLARE total INT DEFAULT 0;

  SELECT COUNT(playerid)
  INTO total
  FROM Player
  WHERE teamid = p_teamid;

  RETURN total;
END$$

-- Get total goals in a match
CREATE FUNCTION GetMatchGoals(p_matchid INT)
RETURNS INT
DETERMINISTIC
BEGIN
  DECLARE total INT DEFAULT 0;

  SELECT COUNT(goalid)
  INTO total
  FROM Goal
  WHERE matchid = p_matchid;

  RETURN total;
END$$

-- Get total matches played in a stadium
CREATE FUNCTION GetStadiumMatches(p_stadiumid INT)
RETURNS INT
DETERMINISTIC
BEGIN
  DECLARE total INT DEFAULT 0;

  SELECT COUNT(matchid)
  INTO total
  FROM Matches
  WHERE stadiumid = p_stadiumid;

  RETURN total;
END$$

-- Get total teams managed by a manager (should be 1 but useful for validation)
CREATE FUNCTION GetManagerTeamCount(p_managerid INT)
RETURNS INT
DETERMINISTIC
BEGIN
  DECLARE total INT DEFAULT 0;

  SELECT COUNT(teamid)
  INTO total
  FROM Manager
  WHERE managerid = p_managerid;

  RETURN total;
END$$

DELIMITER ;
