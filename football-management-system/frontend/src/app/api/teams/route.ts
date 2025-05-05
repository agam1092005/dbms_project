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
      SELECT t.*, m.fullname as manager_name, m.managerid
      FROM Team t
      LEFT JOIN Manager m ON t.teamid = m.teamid
      ORDER BY t.team_name
    `)

    return NextResponse.json(rows)
  } catch (error) {
    const sqlMessage = error.sqlMessage || error.message || 'Unknown error';
    return NextResponse.json(
      { error: sqlMessage },
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
    const { team_name } = await request.json()

    if (!team_name) {
      return NextResponse.json(
        { error: 'Team name is required' },
        { status: 400 }
      )
    }

    connection = await mysql.createConnection(dbConfig)

    const [result] = await connection.execute(
      'INSERT INTO Team (team_name) VALUES (?)',
      [team_name]
    )

    return NextResponse.json({ message: 'Team added successfully', result })
  } catch (error) {
    const sqlMessage = error.sqlMessage || error.message || 'Unknown error';
    return NextResponse.json(
      { error: sqlMessage },
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
    const teamid = searchParams.get('teamid')

    if (!teamid) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      )
    }

    connection = await mysql.createConnection(dbConfig)

    await connection.execute('DELETE FROM Team WHERE teamid = ?', [teamid])

    return NextResponse.json({ message: 'Team deleted successfully' })
  } catch (error) {
    const sqlMessage = error.sqlMessage || error.message || 'Unknown error';
    return NextResponse.json(
      { error: sqlMessage },
      { status: 500 }
    )
  } finally {
    if (connection) {
      await connection.end()
    }
  }
} 