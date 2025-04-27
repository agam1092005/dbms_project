USE football_management_system;

DELIMITER $$

CREATE PROCEDURE InsertMatchAndGoals()
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION 
  BEGIN
    ROLLBACK;
    SELECT 'Error occurred while inserting match and goals.' AS ErrorMessage;
  END;

  START TRANSACTION;

  -- Insert Match
  INSERT INTO Matches (matchid, match_date, team1id, team2id, stadiumid)
  VALUES (404, '2025-03-20', 2, 3, 302);

  -- Insert Goals
  INSERT INTO Goal (goalid, playerid, matchid, time) VALUES
  (506, 103, 404, '00:20:00'),
  (507, 104, 404, '00:35:00');

  COMMIT;

  SELECT 'Match and Goals inserted successfully.' AS SuccessMessage;
END$$

DELIMITER ;
