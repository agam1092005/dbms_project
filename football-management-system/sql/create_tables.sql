USE football_management_system;

-- Team
CREATE TABLE Team (
  teamid INT PRIMARY KEY,
  team_name VARCHAR(100) NOT NULL
);

-- Player
CREATE TABLE Player (
  playerid INT PRIMARY KEY,
  fullname VARCHAR(100) NOT NULL,
  nationality VARCHAR(50),
  teamid INT,
  FOREIGN KEY (teamid) REFERENCES Team(teamid)
);

-- Manager
CREATE TABLE Manager (
  managerid INT PRIMARY KEY,
  fullname VARCHAR(100) NOT NULL,
  teamid INT,
  FOREIGN KEY (teamid) REFERENCES Team(teamid)
);

-- Stadium
CREATE TABLE Stadium (
  stadiumid INT PRIMARY KEY,
  stadium_name VARCHAR(100),
  city VARCHAR(50)
);

-- Match
CREATE TABLE Matches (
  matchid INT PRIMARY KEY,
  match_date DATE,
  team1id INT,
  team2id INT,
  stadiumid INT,
  FOREIGN KEY (team1id) REFERENCES Team(teamid),
  FOREIGN KEY (team2id) REFERENCES Team(teamid),
  FOREIGN KEY (stadiumid) REFERENCES Stadium(stadiumid)
);

-- Goal
CREATE TABLE Goal (
  goalid INT PRIMARY KEY,
  playerid INT,
  matchid INT,
  time TIME,
  FOREIGN KEY (playerid) REFERENCES Player(playerid),
  FOREIGN KEY (matchid) REFERENCES Matches(matchid)
);
