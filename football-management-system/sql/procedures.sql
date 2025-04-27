USE football_management_system;

DELIMITER $$

CREATE PROCEDURE AddPlayer(
  IN p_fullname VARCHAR(100),
  IN p_nationality VARCHAR(50),
  IN p_teamid INT
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION 
  BEGIN
    ROLLBACK;
    SELECT 'Error occurred while adding player.' AS ErrorMessage;
  END;

  START TRANSACTION;

  INSERT INTO Player (fullname, nationality, teamid)
  VALUES (p_fullname, p_nationality, p_teamid);

  COMMIT;
  
  SELECT 'Player added successfully.' AS SuccessMessage;
END$$

DELIMITER ;
