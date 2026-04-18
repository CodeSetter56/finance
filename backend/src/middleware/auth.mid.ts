import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import type { AuthPayload } from '../types.js'

// verifies access token sent in the Authorization header of the request and attaches the decoded user information to the request object
// this middleware is used to protect routes that require authentication, ensuring that only requests with a valid token can access those routes
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // authoriztion: Bearer <token>
  const authHeader = req.headers['authorization']
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' })
  }
  const token = authHeader && authHeader.split(' ')[1] // <token>

  jwt.verify(token!, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err)
      return res.status(403).json({ message: 'Invalid token' })
    }
    req.user = user as AuthPayload
    next()
  })
}

export const verifyRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role
    if (userRole !== role) {
      return res.status(403).json({ message: 'Access denied' })
    }
    next()
  }
}