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

    const [rows] = await connection.execute('SELECT * FROM Stadium ORDER BY stadium_name')

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching stadiums:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stadiums' },
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
    const { stadium_name, city } = await request.json()

    if (!stadium_name || !city) {
      return NextResponse.json(
        { error: 'Stadium name and city are required' },
        { status: 400 }
      )
    }

    connection = await mysql.createConnection(dbConfig)

    const [result] = await connection.execute(
      'INSERT INTO Stadium (stadium_name, city) VALUES (?, ?)',
      [stadium_name, city]
    )

    return NextResponse.json({ message: 'Stadium added successfully', result })
  } catch (error) {
    console.error('Error adding stadium:', error)
    return NextResponse.json(
      { error: 'Failed to add stadium' },
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
    const stadiumid = searchParams.get('stadiumid')

    if (!stadiumid) {
      return NextResponse.json(
        { error: 'Stadium ID is required' },
        { status: 400 }
      )
    }

    connection = await mysql.createConnection(dbConfig)

    await connection.execute('DELETE FROM Stadium WHERE stadiumid = ?', [stadiumid])

    return NextResponse.json({ message: 'Stadium deleted successfully' })
  } catch (error) {
    console.error('Error deleting stadium:', error)
    return NextResponse.json(
      { error: 'Failed to delete stadium' },
      { status: 500 }
    )
  } finally {
    if (connection) {
      await connection.end()
    }
  }
} 