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
      SELECT 
        m.matchid,
        m.match_date,
        m.team1id,
        m.team2id,
        m.stadiumid,
        t1.team_name as team1_name,
        t2.team_name as team2_name,
        s.stadium_name,
        s.city
      FROM Matches m
      LEFT JOIN Team t1 ON m.team1id = t1.teamid
      LEFT JOIN Team t2 ON m.team2id = t2.teamid
      LEFT JOIN Stadium s ON m.stadiumid = s.stadiumid
      ORDER BY m.match_date DESC
    `)

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    )
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

export async function POST(request: Request) {
  let connection
  try {
    const { match_date, team1id, team2id, stadiumid } = await request.json()

    if (!match_date || !team1id || !team2id || !stadiumid) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (team1id === team2id) {
      return NextResponse.json(
        { error: 'A team cannot play against itself' },
        { status: 400 }
      )
    }

    connection = await mysql.createConnection(dbConfig)

    // Check if teams and stadium exist
    const [teams] = await connection.execute(
      'SELECT teamid FROM Team WHERE teamid IN (?, ?)',
      [team1id, team2id]
    )
    if (Array.isArray(teams) && teams.length !== 2) {
      return NextResponse.json(
        { error: 'One or both teams do not exist' },
        { status: 400 }
      )
    }

    const [stadiums] = await connection.execute(
      'SELECT stadiumid FROM Stadium WHERE stadiumid = ?',
      [stadiumid]
    )
    if (Array.isArray(stadiums) && stadiums.length !== 1) {
      return NextResponse.json(
        { error: 'Stadium does not exist' },
        { status: 400 }
      )
    }

    const [result] = await connection.execute(
      'INSERT INTO Matches (match_date, team1id, team2id, stadiumid) VALUES (?, ?, ?, ?)',
      [match_date, team1id, team2id, stadiumid]
    )

    return NextResponse.json({ message: 'Match added successfully', result })
  } catch (error) {
    console.error('Error adding match:', error)
    return NextResponse.json(
      { error: 'Failed to add match' },
      { status: 500 }
    )
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

export async function DELETE(request: Request) {
  let connection
  try {
    const { searchParams } = new URL(request.url)
    const matchid = searchParams.get('matchid')

    if (!matchid) {
      return NextResponse.json(
        { error: 'Match ID is required' },
        { status: 400 }
      )
    }

    connection = await mysql.createConnection(dbConfig)

    await connection.execute('DELETE FROM Matches WHERE matchid = ?', [matchid])

    return NextResponse.json({ message: 'Match deleted successfully' })
  } catch (error) {
    console.error('Error deleting match:', error)
    return NextResponse.json(
      { error: 'Failed to delete match' },
      { status: 500 }
    )
  } finally {
    if (connection) {
      await connection.end()
    }
  }
} 