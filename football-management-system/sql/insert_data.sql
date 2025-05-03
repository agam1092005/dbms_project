USE football_management_system;

-- Insert Teams
INSERT INTO Team (teamid, team_name) VALUES
(1, 'Manchester United'),
(2, 'Chelsea'),
(3, 'Real Madrid'),
(4, 'Barcelona');

-- Insert Players
INSERT INTO Player (playerid, fullname, nationality, teamid) VALUES
(101, 'Marcus Rashford', 'England', 1),
(102, 'Bruno Fernandes', 'Portugal', 1),
(103, 'Mason Mount', 'England', 2),
(104, 'Karim Benzema', 'France', 3),
(105, 'Pedri', 'Spain', 4);

-- Insert Managers
INSERT INTO Manager (managerid, fullname, teamid) VALUES
(201, 'Erik ten Hag', 1),
(202, 'Mauricio Pochettino', 2),
(203, 'Carlo Ancelotti', 3),
(204, 'Xavi Hernandez', 4);

-- Insert Stadiums
INSERT INTO Stadium (stadiumid, stadium_name, city) VALUES
(301, 'Old Trafford', 'Manchester'),
(302, 'Stamford Bridge', 'London'),
(303, 'Santiago Bernabéu', 'Madrid'),
(304, 'Camp Nou', 'Barcelona');

-- Insert Matches
INSERT INTO Matches (matchid, match_date, team1id, team2id, stadiumid) VALUES
(401, '2025-03-01', 1, 2, 301),
(402, '2025-03-05', 3, 4, 303),
(403, '2025-03-10', 1, 4, 301);

-- Insert Goals (converted TIME to time_minute INT)
INSERT INTO Goal (goalid, playerid, matchid, time_minute) VALUES
(501, 101, 401, 15),
(502, 102, 401, 30),
(503, 104, 402, 10),
(504, 105, 402, 40),
(505, 101, 403, 25);