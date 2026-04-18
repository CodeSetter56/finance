import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()

  const [error, setError] = useState('')
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) {
        return setError(data.message || 'Something went wrong')
      }

      setAuth({
        accessToken: data.accessToken,
        role: data.user.role,
      })

      switch (data.user.role) {
        case 'admin':
          navigate('/admin')
          break
        case 'user':
          navigate('/user')
          break
        default:
          navigate('/')
          break
      }

      console.log('Login successful:', data)
      
    } catch (error) {
      console.error('Login failed:', error)
      setError('Could not connect to the server. Please try again later.')
    }
  }

  return (
    <div className='w-full h-full flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-extrabold text-gray-900'>Login</h1>
          <p className='text-gray-500 mt-2'>Please enter your details</p>
        </div>

        <form className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type='email'
              className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none'
              placeholder='you@example.com'
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Password
            </label>
            <input
              type='password'
              className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none'
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            onClick={handleLogin}
            className='w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition-colors'
          >
            Log In
          </button>
          <p className='flex justify-center gap-1'>
            New user? Register
            <span>
              <Link
                to={'/register'}
                className='text-orange-600 hover:underline'
              >
                here
              </Link>
            </span>
          </p>
        </form>
        {error && <p className='text-red-500 mt-4 text-center'>{error}</p>}
      </div>
    </div>
  )
}

export default Login
