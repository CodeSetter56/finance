import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface AuthData {
  accessToken: string;
  role: string;
}

interface AuthContextType {
  auth: AuthData | null;
  setAuth: (auth: AuthData | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setAuth({
            accessToken: data.accessToken,
            role: data.user.role,
          });
        } else {
          setAuth(null);
        }
      } catch (error) {
        setAuth(null);
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => { 
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 