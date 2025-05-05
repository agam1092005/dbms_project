import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'football_management_system',
}

// GET: List all managers with their teams
export async function GET() {
  let connection
  try {
    connection = await mysql.createConnection(dbConfig)
    const [rows] = await connection.execute(`
      SELECT m.managerid, m.fullname, t.teamid, t.team_name
      FROM Manager m
      JOIN Team t ON m.teamid = t.teamid
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

// POST: Assign a manager to a team
export async function POST(request: Request) {
  let connection
  try {
    const { fullname, teamid } = await request.json()
    if (!fullname || !teamid) {
      return NextResponse.json(
        { error: 'Manager name and team are required' },
        { status: 400 }
      )
    }
    connection = await mysql.createConnection(dbConfig)
    // Check if team already has a manager
    const [existing] = await connection.execute(
      'SELECT managerid FROM Manager WHERE teamid = ?',
      [teamid]
    )
    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json(
        { error: 'This team already has a manager' },
        { status: 400 }
      )
    }
    // Insert manager
    const [result] = await connection.execute(
      'INSERT INTO Manager (fullname, teamid) VALUES (?, ?)',
      [fullname, teamid]
    )
    return NextResponse.json({ message: 'Manager assigned successfully', result })
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

// DELETE: Remove a manager
export async function DELETE(request: Request) {
  let connection
  try {
    const { searchParams } = new URL(request.url)
    const managerid = searchParams.get('managerid')
    if (!managerid) {
      return NextResponse.json(
        { error: 'Manager ID is required' },
        { status: 400 }
      )
    }
    connection = await mysql.createConnection(dbConfig)
    await connection.execute('DELETE FROM Manager WHERE managerid = ?', [managerid])
    return NextResponse.json({ message: 'Manager deleted successfully' })
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