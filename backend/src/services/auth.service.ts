import type { Request, Response } from "express";
import { db } from "../db/db.js";
import { Users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }
    
    const existingUser = await db.select().from(Users).where(eq(Users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'user already exists' })
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)
    const [newUser] = await db.insert(Users).values({
      name,
      email,
      password: hashedPassword,
    }).returning()
    
    return res.status(201).json({
      message: 'User registered successfully', user: {
        id: newUser!.id,
        name: newUser!.name,
        email: newUser!.email,
        role: newUser!.role,
    } })
    
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ message: 'Registration failed'})
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }
    
    const [user] = await db.select().from(Users).where(eq(Users.email, email)).limit(1);
    if (!user) {
      return res.status(400).json({ message: 'user not found' })
    }
    
    const matchPassword = await bcrypt.compare(password, user.password)
    if (!matchPassword) {
      return res.status(400).json({ message: 'Invalid password' })
    }
    
    // keeps user logged in for 15 mins
    const accessToken = jwt.sign({ userId: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' })
    // refresh token keeps user logged in for 12 hours, it will be stored in a httpOnly cookie to prevent XSS attacks.
    const refreshToken = jwt.sign({ userId: user.id, role: user.role }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '12h' })
    // maxage should be the same as the refresh token expiration time
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 12 * 60 * 60 * 1000 }) 
    
    return res.status(200).json({
      message: 'Login successful', accessToken, user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, 
    } })
    
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ message: 'Login failed'})
  }
}

// after accessToken expires, this func verifies the refresh token and creates a new access token
export const refreshToken = async (req: Request, res: Response) => {
  // parsed using cookie parser middleware
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' })
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!)
    const [user] = await db.select().from(Users).where(eq(Users.id, (decoded as any).userId)).limit(1)
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }
    
    const newAccessToken = jwt.sign({ userId: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' })
    
    return res.status(200).json({
      accessToken: newAccessToken, user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role, 
      }
    })
    
  }
  catch (error) {
    console.error('Error:', error)
    return res.status(403).json({ message: 'Invalid refresh token'})
  }
}

export const logout = (req: Request, res: Response) => {
  try {
    res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 12 * 60 * 60 * 1000  })
    
    return res.status(200).json({ message: 'Logout successful' })
    
  }catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ message: 'Logout failed'})
  }
}