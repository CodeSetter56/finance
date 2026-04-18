import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const navigate = useNavigate()
  const { auth, setAuth } = useAuth()

  const handleLogout = async() => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      setAuth(null)
      navigate("/login")
      
    }catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className='w-full bg-orange-600 p-4 '>
      <div className='container flex justify-between items-center mx-auto'>
        <Link to={'/'} className='text-white text-2xl font-bold'>
          FT
        </Link>
        {auth?.accessToken ? (
          <>
            <button onClick={handleLogout}>logout</button>
          </>
        ) : (
          <>
            <div className='flex gap-2'>
              <button onClick={()=>navigate("/login")}>login</button>
              <button onClick={()=>navigate("/register")}>Register</button>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
