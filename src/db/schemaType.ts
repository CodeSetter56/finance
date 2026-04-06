import { pgEnum } from "drizzle-orm/pg-core"

export const typeEnum = pgEnum('record_type', ['income', 'expense'])

export const categoryEnum = pgEnum('category', [
  "electricity",
  "food",
  "rent",
  "entertainment",
  "transportation",
  "healthcare",
  "education",
  "miscellaneous",
])

export const roleEnum = pgEnum('user_role', ['admin', 'analyst', 'viewer'])
