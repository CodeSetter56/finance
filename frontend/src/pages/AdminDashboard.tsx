import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface PaginationData {
  totalUsers: number;
  totalPages: number;
  currPage: number;
}

function AdminDashboard() {
  const { auth } = useAuth()

  const [error, setError] = useState('')
  const [profile, setProfile] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationData>({
    totalUsers: 0,
    totalPages: 1,
    currPage: 1,
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth?.accessToken) return
      try {
        const res = await fetch('/api/user/me', {
          headers: { Authorization: `Bearer ${auth.accessToken}` },
          credentials: 'include',
        })
        const data = await res.json()
        if (res.ok) {
          setProfile(data.user) 
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        setError('Could not fetch profile. Please try again later.')
      }
    }
    fetchProfile()
  }, [auth])

  useEffect(() => {
    const fetchUsers = async () => {
      if (!auth?.accessToken) return
      try {
        const res = await fetch(`/api/user?page=${page}&limit=2`, {
          headers: { Authorization: `Bearer ${auth.accessToken}` },
          credentials: 'include',
        })
        const data = await res.json()

        if (res.ok) {
          setUsers(data.users)
          setPagination({
            totalUsers: data.totalUsers,
            totalPages: data.totalPages,
            currPage: data.currPage,
          })
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        setError('Could not fetch users. Please try again later.')
      }
    }
    fetchUsers()
  }, [auth, page])

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
          <h1 className='text-3xl font-bold text-gray-900'>Admin Panel</h1>
          <div className='mt-4 flex flex-wrap gap-6 text-gray-600'>
            <p><span className="font-semibold">Name:</span> {profile?.name}</p>
            <p><span className="font-semibold">Email:</span> {profile?.email}</p>
            <p><span className="font-semibold">Role:</span> 
              <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm uppercase">
                {profile?.role}
              </span>
            </p>
          </div>
        </section>

        <section className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">System Users</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 font-mono">{user.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Showing page {pagination.currPage} of {pagination.totalPages} ({pagination.totalUsers} users total)
            </span>
            <div className="flex gap-3">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={page >= pagination.totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AdminDashboard