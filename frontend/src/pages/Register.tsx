import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
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
   
      navigate('/login')

      console.log('Registration successful:', data)
      
    } catch (error) {
      console.error('Registration failed:', error)
      setError('Could not connect to the server. Please try again later.')
    }
  }

  return (
    <div className='w-full h-full flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-extrabold text-gray-900'>Register</h1>
          <p className='text-gray-500 mt-2'>Please enter your details</p>
        </div>

        <form className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Name
            </label>
            <input
              type='text'
              className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none'
              placeholder='Username'
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
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
            onClick={handleRegister}
            className='w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition-colors'
          >
            Register
          </button>
          <p className='flex justify-center gap-1'>
            Already a user? Login
            <span>
              <Link
                to={'/login'}
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

export default Register
