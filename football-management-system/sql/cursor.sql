USE football_management_system;

DELIMITER $$

CREATE PROCEDURE CursorPlayerGoals()
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE p_id INT;
  DECLARE p_name VARCHAR(100);
  DECLARE goal_count INT;

  -- Cursor to loop over players
  DECLARE player_cursor CURSOR FOR
    SELECT playerid, fullname FROM Player;

  -- Exit handler when cursor is done
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  -- Create temp summary table (optional: run only once or with IF NOT EXISTS)
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

    -- Count goals
    SELECT COUNT(*) INTO goal_count
    FROM Goal
    WHERE playerid = p_id;

    -- Insert into summary table
    INSERT INTO PlayerGoalSummary (playerid, player_name, total_goals)
    VALUES (p_id, p_name, goal_count);
  END LOOP;

  CLOSE player_cursor;

  -- Display results
  SELECT * FROM PlayerGoalSummary;
END$$

DELIMITER ;
