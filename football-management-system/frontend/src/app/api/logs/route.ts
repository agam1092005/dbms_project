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
      SELECT logid, operation_type, details, log_time
      FROM OperationLog
      ORDER BY log_time DESC
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