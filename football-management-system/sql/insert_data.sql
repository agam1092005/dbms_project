INSERT INTO Team (teamid, team_name) VALUES
(1, 'Manchester United'),
(2, 'Chelsea'),
(3, 'Real Madrid'),
(4, 'Barcelona');


INSERT INTO Player (playerid, fullname, nationality, teamid) VALUES
(101, 'Marcus Rashford', 'England', 1),
(102, 'Bruno Fernandes', 'Portugal', 1),
(103, 'Mason Mount', 'England', 2),
(104, 'Karim Benzema', 'France', 3),
(105, 'Pedri', 'Spain', 4);


INSERT INTO Manager (managerid, fullname, teamid) VALUES
(201, 'Erik ten Hag', 1),
(202, 'Mauricio Pochettino', 2),
(203, 'Carlo Ancelotti', 3),
(204, 'Xavi Hernandez', 4);


INSERT INTO Stadium (stadiumid, stadium_name, city) VALUES
(301, 'Old Trafford', 'Manchester'),
(302, 'Stamford Bridge', 'London'),
(303, 'Santiago Bernabéu', 'Madrid'),
(304, 'Camp Nou', 'Barcelona');


INSERT INTO Matches (matchid, match_date, team1id, team2id, stadiumid) VALUES
(401, '2025-03-01', 1, 2, 301),
(402, '2025-03-05', 3, 4, 303),
(403, '2025-03-10', 1, 4, 301);


INSERT INTO Goal (goalid, playerid, matchid, time) VALUES
(501, 101, 401, '00:15:00'),
(502, 102, 401, '00:30:00'),
(503, 104, 402, '00:10:00'),
(504, 105, 402, '00:40:00'),
(505, 101, 403, '00:25:00');


