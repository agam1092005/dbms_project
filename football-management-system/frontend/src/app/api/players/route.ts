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
      SELECT p.*, t.team_name
      FROM Player p
      LEFT JOIN Team t ON p.teamid = t.teamid
      ORDER BY p.fullname
    `)

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching players:', error)
    return NextResponse.json(
      { error: 'Failed to fetch players' },
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
    const { fullname, nationality, teamid } = await request.json()

    if (!fullname || !teamid) {
      return NextResponse.json(
        { error: 'Full name and team are required' },
        { status: 400 }
      )
    }

    connection = await mysql.createConnection(dbConfig)

    // Check if team exists
    const [teams] = await connection.execute(
      'SELECT teamid FROM Team WHERE teamid = ?',
      [teamid]
    )
    if (Array.isArray(teams) && teams.length !== 1) {
      return NextResponse.json(
        { error: 'Team does not exist' },
        { status: 400 }
      )
    }

    const [result] = await connection.execute(
      'INSERT INTO Player (fullname, nationality, teamid) VALUES (?, ?, ?)',
      [fullname, nationality, teamid]
    )

    return NextResponse.json({ message: 'Player added successfully', result })
  } catch (error) {
    console.error('Error adding player:', error)
    return NextResponse.json(
      { error: 'Failed to add player' },
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
    const playerid = searchParams.get('playerid')

    if (!playerid) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      )
    }

    connection = await mysql.createConnection(dbConfig)

    await connection.execute('DELETE FROM Player WHERE playerid = ?', [playerid])

    return NextResponse.json({ message: 'Player deleted successfully' })
  } catch (error) {
    console.error('Error deleting player:', error)
    return NextResponse.json(
      { error: 'Failed to delete player' },
      { status: 500 }
    )
  } finally {
    if (connection) {
      await connection.end()
    }
  }
} 