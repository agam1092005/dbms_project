import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'football_management_system',
}

export async function GET() {
  let connection
  try {
    connection = await mysql.createConnection(dbConfig)

    const [rows] = await connection.execute(`
      SELECT l.*, 
        CASE 
          WHEN l.operation_type = 'INSERT' AND l.table_name = 'Player' THEN CONCAT('Added player: ', p.fullname)
          WHEN l.operation_type = 'DELETE' AND l.table_name = 'Player' THEN CONCAT('Deleted player: ', p.fullname)
          WHEN l.operation_type = 'INSERT' AND l.table_name = 'Team' THEN CONCAT('Added team: ', t.team_name)
          WHEN l.operation_type = 'DELETE' AND l.table_name = 'Team' THEN CONCAT('Deleted team: ', t.team_name)
          WHEN l.operation_type = 'INSERT' AND l.table_name = 'Matches' THEN CONCAT('Added match: ', t1.team_name, ' vs ', t2.team_name)
          WHEN l.operation_type = 'DELETE' AND l.table_name = 'Matches' THEN CONCAT('Deleted match: ', t1.team_name, ' vs ', t2.team_name)
          WHEN l.operation_type = 'INSERT' AND l.table_name = 'Goal' THEN CONCAT('Added goal: ', p.fullname, ' (', t.team_name, ')')
          WHEN l.operation_type = 'DELETE' AND l.table_name = 'Goal' THEN CONCAT('Deleted goal: ', p.fullname, ' (', t.team_name, ')')
          ELSE CONCAT(l.operation_type, ' on ', l.table_name)
        END as description
      FROM OperationLog l
      LEFT JOIN Player p ON l.record_id = p.playerid AND l.table_name = 'Player'
      LEFT JOIN Team t ON l.record_id = t.teamid AND l.table_name = 'Team'
      LEFT JOIN Matches m ON l.record_id = m.matchid AND l.table_name = 'Matches'
      LEFT JOIN Team t1 ON m.team1id = t1.teamid
      LEFT JOIN Team t2 ON m.team2id = t2.teamid
      LEFT JOIN Goal g ON l.record_id = g.goalid AND l.table_name = 'Goal'
      LEFT JOIN Player pg ON g.playerid = pg.playerid
      LEFT JOIN Team tg ON pg.teamid = tg.teamid
      ORDER BY l.timestamp DESC
    `)

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    )
  } finally {
    if (connection) {
      await connection.end()
    }
  }
} 