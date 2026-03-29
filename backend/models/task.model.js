import { pgTable, serial, varchar, pgEnum, integer, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './user.model.js'

export const statusEnum = pgEnum('status', ['incompleted', 'completed']);

export const tasks = pgTable('tasks', {
  task_id: serial('task_id').primaryKey(),
  task: varchar('task', { length: 255 }).notNull(),
  status: statusEnum('status').notNull().default('incompleted'),
  userId: integer('user_id').notNull().references(() => users.id),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})

// one task -> one user (inverse of usersRelations)
export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}))