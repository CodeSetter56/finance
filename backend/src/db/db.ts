import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema.js'
import 'dotenv/config'

import { Users } from './schema.js'

const sql = neon(process.env.DATABASE_URL!)

export const db = drizzle(sql, { schema })

export const checkConnection = async () => {
  try {
    await db.select().from(Users).limit(1)
    console.log('Database connected successfully')
  } catch (err) {
    console.error('Database connection failed:', err)
    process.exit(1)
  }
}