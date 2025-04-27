USE football_management_system;

DELIMITER $$

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

DELIMITER ;
