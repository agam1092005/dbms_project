USE football_management_system;

-- Team
CREATE TABLE Team (
  teamid INT PRIMARY KEY AUTO_INCREMENT,
  team_name VARCHAR(100) NOT NULL UNIQUE
);

-- Player
CREATE TABLE Player (
  playerid INT PRIMARY KEY AUTO_INCREMENT,
  fullname VARCHAR(100) NOT NULL,
  nationality VARCHAR(50),
  teamid INT,
  FOREIGN KEY (teamid) REFERENCES Team(teamid) ON DELETE CASCADE
);

-- Manager
CREATE TABLE Manager (
  managerid INT PRIMARY KEY AUTO_INCREMENT,
  fullname VARCHAR(100) NOT NULL,
  teamid INT UNIQUE,
  FOREIGN KEY (teamid) REFERENCES Team(teamid) ON DELETE CASCADE
);

-- Stadium
CREATE TABLE Stadium (
  stadiumid INT PRIMARY KEY AUTO_INCREMENT,
  stadium_name VARCHAR(100),
  city VARCHAR(50)
);

-- Match
CREATE TABLE Matches (
  matchid INT PRIMARY KEY AUTO_INCREMENT,
  match_date DATE,
  team1id INT,
  team2id INT,
  stadiumid INT,
  FOREIGN KEY (team1id) REFERENCES Team(teamid) ON DELETE CASCADE,
  FOREIGN KEY (team2id) REFERENCES Team(teamid) ON DELETE CASCADE,
  FOREIGN KEY (stadiumid) REFERENCES Stadium(stadiumid) ON DELETE CASCADE,
  CHECK (team1id <> team2id)
);

-- Goal
CREATE TABLE Goal (
  goalid INT PRIMARY KEY AUTO_INCREMENT,
  playerid INT,
  matchid INT,
  time_minute INT CHECK (time_minute BETWEEN 0 AND 120),
  FOREIGN KEY (playerid) REFERENCES Player(playerid) ON DELETE CASCADE,
  FOREIGN KEY (matchid) REFERENCES Matches(matchid) ON DELETE CASCADE
);