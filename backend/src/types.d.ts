import type { InferSelectModel } from "drizzle-orm";
import type { Users } from "./db/schema.ts";

// env
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      PORT: string;
      NODE_ENV: 'development' | 'production';
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
    }
  }
}

// auth middleware
export interface AuthPayload {
  userId: number;
  role: 'admin' | 'user';
}
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

// profile
type User = InferSelectModel<typeof Users>;
type SafeUser = Omit<User, 'password'>;

// data response
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    totalItems: number;
    totalPages: number;
    currPage: number;
    limit: number;
  };
}