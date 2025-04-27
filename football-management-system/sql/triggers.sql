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

DELIMITER ;
