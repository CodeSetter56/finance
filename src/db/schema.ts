import { typeEnum, categoryEnum, roleEnum } from './schemaType.js'
import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'

export const Users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: roleEnum('role').default('viewer').notNull(), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const Records = pgTable('records', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => Users.id),
  amount: integer('amount').notNull(), 
  type: typeEnum('type').notNull(),    
  category: categoryEnum('category').notNull(), 
  description: text('description'),
  date: timestamp('date').defaultNow().notNull(),
})

