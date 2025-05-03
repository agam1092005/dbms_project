USE football_management_system;

DELIMITER $$

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

  -- Check if teamid exists
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

DELIMITER ;
