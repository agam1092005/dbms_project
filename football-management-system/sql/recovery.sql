USE football_management_system;

-- Log table to store "manual" transaction records
CREATE TABLE IF NOT EXISTS OperationLog (
  logid INT AUTO_INCREMENT PRIMARY KEY,
  operation_type VARCHAR(50),
  details TEXT,
  log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Procedure to simulate a player insert with logging
DELIMITER $$

CREATE PROCEDURE AddPlayerWithLogging(
  IN p_fullname VARCHAR(100),
  IN p_nationality VARCHAR(50),
  IN p_teamid INT
)
BEGIN
  DECLARE team_exists INT DEFAULT 0;

  START TRANSACTION;

  -- Check if team exists
  SELECT COUNT(*) INTO team_exists FROM Team WHERE teamid = p_teamid;

  IF team_exists = 0 THEN
    ROLLBACK;
    INSERT INTO OperationLog(operation_type, details)
    VALUES ('FAILED_INSERT', CONCAT('Player "', p_fullname, '" - Invalid team ID: ', p_teamid));
    
    SELECT 'Insert failed. Team does not exist.' AS Message;
  ELSE
    INSERT INTO Player(fullname, nationality, teamid)
    VALUES (p_fullname, p_nationality, p_teamid);

    COMMIT;

    INSERT INTO OperationLog(operation_type, details)
    VALUES ('INSERT_PLAYER', CONCAT('Player "', p_fullname, '" added to team ID: ', p_teamid));

    SELECT 'Player inserted and logged.' AS Message;
  END IF;
END$$

DELIMITER ;
