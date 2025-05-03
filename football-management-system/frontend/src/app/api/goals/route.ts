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
      SELECT g.*, p.fullname as player_name, t.team_name, m.match_date
      FROM Goal g
      JOIN Player p ON g.playerid = p.playerid
      JOIN Team t ON p.teamid = t.teamid
      JOIN Matches m ON g.matchid = m.matchid
    `)

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
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
    const { playerid, matchid, time_minute } = await request.json()

    if (!playerid || !matchid || !time_minute) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    connection = await mysql.createConnection(dbConfig)

    // Check if player and match exist
    const [players] = await connection.execute(
      'SELECT playerid FROM Player WHERE playerid = ?',
      [playerid]
    )
    if (Array.isArray(players) && players.length !== 1) {
      return NextResponse.json(
        { error: 'Player does not exist' },
        { status: 400 }
      )
    }

    const [matches] = await connection.execute(
      'SELECT matchid FROM Matches WHERE matchid = ?',
      [matchid]
    )
    if (Array.isArray(matches) && matches.length !== 1) {
      return NextResponse.json(
        { error: 'Match does not exist' },
        { status: 400 }
      )
    }

    const [result] = await connection.execute(
      'INSERT INTO Goal (playerid, matchid, time_minute) VALUES (?, ?, ?)',
      [playerid, matchid, time_minute]
    )

    return NextResponse.json({ message: 'Goal added successfully', result })
  } catch (error) {
    console.error('Error adding goal:', error)
    return NextResponse.json(
      { error: 'Failed to add goal' },
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
    const goalid = searchParams.get('goalid')

    if (!goalid) {
      return NextResponse.json(
        { error: 'Goal ID is required' },
        { status: 400 }
      )
    }

    connection = await mysql.createConnection(dbConfig)

    await connection.execute('DELETE FROM Goal WHERE goalid = ?', [goalid])

    return NextResponse.json({ message: 'Goal deleted successfully' })
  } catch (error) {
    console.error('Error deleting goal:', error)
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    )
  } finally {
    if (connection) {
      await connection.end()
    }
  }
} 