SELECT P.fullname AS player_name, T.team_name
FROM Player P
JOIN Team T ON P.teamid = T.teamid;


SELECT P.fullname, COUNT(G.goalid) AS total_goals
FROM Player P
JOIN Goal G ON P.playerid = G.playerid
GROUP BY P.playerid
ORDER BY total_goals DESC;


SELECT M.matchid, M.match_date,
       T1.team_name AS team1, T2.team_name AS team2,
       S.stadium_name
FROM Matches M
JOIN Team T1 ON M.team1id = T1.teamid
JOIN Team T2 ON M.team2id = T2.teamid
JOIN Stadium S ON M.stadiumid = S.stadiumid;


SELECT P.fullname, COUNT(G.goalid) AS goal_count
FROM Player P
JOIN Goal G ON P.playerid = G.playerid
GROUP BY P.playerid
HAVING COUNT(G.goalid) > 1;


SELECT * FROM Matches
WHERE match_date = (
  SELECT MAX(match_date) FROM Matches
);


SELECT fullname
FROM Player
WHERE playerid IN (
  SELECT playerid
  FROM Goal
  WHERE matchid = 401
);


SELECT team_name
FROM Team T
WHERE NOT EXISTS (
  SELECT 1
  FROM Matches M
  WHERE T.teamid = M.team1id OR T.teamid = M.team2id
);


SELECT P.fullname, COUNT(G.goalid) AS goals
FROM Player P
JOIN Goal G ON P.playerid = G.playerid
GROUP BY P.playerid
HAVING COUNT(G.goalid) = (
  SELECT MAX(goal_count) FROM (
    SELECT COUNT(goalid) AS goal_count
    FROM Goal
    GROUP BY playerid
  ) AS counts
);


