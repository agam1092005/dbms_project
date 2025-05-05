USE football_management_system;

INSERT INTO Team (teamid, team_name) VALUES
(1, 'Manchester United'),
(2, 'Chelsea'),
(3, 'Real Madrid'),
(4, 'Barcelona');

-- Insert 11 Players per Team
INSERT INTO Player (playerid, fullname, nationality, teamid) VALUES
-- Manchester United
(101, 'Marcus Rashford', 'England', 1),
(102, 'Bruno Fernandes', 'Portugal', 1),
(103, 'Luke Shaw', 'England', 1),
(104, 'Casemiro', 'Brazil', 1),
(105, 'Lisandro Martinez', 'Argentina', 1),
(106, 'Antony', 'Brazil', 1),
(107, 'Rasmus Højlund', 'Denmark', 1),
(108, 'Christian Eriksen', 'Denmark', 1),
(109, 'Jadon Sancho', 'England', 1),
(110, 'Harry Maguire', 'England', 1),
(111, 'Andre Onana', 'Cameroon', 1),

-- Chelsea
(112, 'Mason Mount', 'England', 2),
(113, 'Reece James', 'England', 2),
(114, 'Thiago Silva', 'Brazil', 2),
(115, 'Ben Chilwell', 'England', 2),
(116, 'Enzo Fernandez', 'Argentina', 2),
(117, 'Noni Madueke', 'England', 2),
(118, 'Raheem Sterling', 'England', 2),
(119, 'Moises Caicedo', 'Ecuador', 2),
(120, 'Axel Disasi', 'France', 2),
(121, 'Robert Sanchez', 'Spain', 2),
(122, 'Levi Colwill', 'England', 2),

-- Real Madrid
(123, 'Karim Benzema', 'France', 3),
(124, 'Luka Modric', 'Croatia', 3),
(125, 'Toni Kroos', 'Germany', 3),
(126, 'Eduardo Camavinga', 'France', 3),
(127, 'Vinícius Júnior', 'Brazil', 3),
(128, 'Rodrygo', 'Brazil', 3),
(129, 'David Alaba', 'Austria', 3),
(130, 'Antonio Rüdiger', 'Germany', 3),
(131, 'Dani Carvajal', 'Spain', 3),
(132, 'Thibaut Courtois', 'Belgium', 3),
(133, 'Aurélien Tchouaméni', 'France', 3),

-- Barcelona
(134, 'Pedri', 'Spain', 4),
(135, 'Gavi', 'Spain', 4),
(136, 'Ferran Torres', 'Spain', 4),
(137, 'Robert Lewandowski', 'Poland', 4),
(138, 'Jules Koundé', 'France', 4),
(139, 'Andreas Christensen', 'Denmark', 4),
(140, 'João Cancelo', 'Portugal', 4),
(141, 'João Félix', 'Portugal', 4),
(142, 'Marc-André ter Stegen', 'Germany', 4),
(143, 'Ilkay Gündogan', 'Germany', 4),
(144, 'Ronald Araújo', 'Uruguay', 4);

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
(401, '2025-05-06', 1, 2, 301),
(402, '2025-05-06', 3, 4, 303);

INSERT INTO Goal (goalid, playerid, matchid, time_minute) VALUES
(501, 101, 401, 15),
(502, 102, 401, 30),
(503, 123, 402, 10),
(504, 134, 402, 40);