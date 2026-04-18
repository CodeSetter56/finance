import type { Request, Response } from "express"
import { db } from "../db/db.js"
import { Users } from "../db/schema.js"
import { count, eq } from "drizzle-orm"
import type { SafeUser } from "../types.js"

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 2
    const offset = (page - 1) * limit
    
    const [result] = await db.select({ value: count() }).from(Users);
    const totalUsers = result?.value ?? 0; // if res is undefined, totalUsers will be 0
    const totalPages = Math.ceil(totalUsers / limit)
    
    const users:SafeUser[]|undefined = await db.query.Users.findMany({
      limit: limit,
      offset: offset,
      columns: {
        password: false, 
      },
    });
    
    return res.status(200).json({users,totalUsers,totalPages,currPage: page})
    
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: 'error while getting users' })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id as string)
    const [user] = await db.select().from(Users).where(eq(Users.id, userId))
    if (!user) {
      return res.status(404).json({ error: 'user not found' })
    }
    // on delete cascade in recordSchema will automatically delete all records associated with the user
    await db.delete(Users).where(eq(Users.id, userId))
    
    return res.status(200).json({ message: 'user deleted successfully' })
    
  }catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: 'error while getting user' })
  }
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id as string)
    const user:SafeUser|undefined = await db.query.Users.findFirst({
      where: eq(Users.id, userId),
      columns: {
        password: false, 
      },
    })
    if (!user) {
      return res.status(404).json({ error: 'user not found' })
    }
    
    return res.status(200).json({ user })
    
  }catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: 'error while getting user' })
  }
}

export const getMyProfile = async (req: Request, res: Response) => {
  try {
    // curr user is globally declared and is set in the auth middleware
    const userId = req.user?.userId
    const user:SafeUser|undefined = await db.query.Users.findFirst({
      where: eq(Users.id, userId!),
      columns: {
        password: false, 
      },
    })
    if (!user) {
      return res.status(404).json({ error: 'user not found' })
    }
    
    return res.status(200).json({ user })
    
  }catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: 'error while getting user' })
  }
}