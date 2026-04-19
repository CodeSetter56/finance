import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

function UserDashboard() {
  const { auth } = useAuth()

  const [error, setError] = useState('')
  const [profile, setProfile] = useState<User | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth?.accessToken) return

      try {
        const res = await fetch('/api/user/me', {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
          credentials: 'include',
        })

        const data = await res.json()
        if (res.ok) {
          setProfile(data.user)
        } else {
          setError(data.error || 'Failed to fetch profile')
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        setError('Could not fetch profile. Please try again later.')
      }
    }
    fetchProfile()
  }, [auth])

  if (!profile && !error) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className='w-full min-h-full bg-gray-50 p-6'>
      <div className='max-w-6xl mx-auto space-y-6'>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <section className='bg-white p-8 rounded-2xl shadow-sm border border-gray-200'>
          <h1 className='text-3xl font-bold text-gray-900'>User Dashboard</h1>
          <div className='mt-4 flex flex-wrap gap-6 text-gray-600'>
            <p><span className="font-semibold text-gray-800">Name:</span> {profile?.name}</p>
            <p><span className="font-semibold text-gray-800">Email:</span> {profile?.email}</p>
            <p><span className="font-semibold text-gray-800">Role:</span> 
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm uppercase font-medium">
                {profile?.role}
              </span>
            </p>
          </div>
        </section>

        <section className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Your Financial Records</h2>
          </div>
          
        </section>

      </div>
    </div>
  )
}

export default UserDashboard