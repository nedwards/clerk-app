'use client'

import { useEffect, useState } from 'react'

interface User {
  id: string
  firstName?: string
  lastName?: string
  emailAddresses: { emailAddress: string }[]
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/get-users')
      const data = await res.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      const res = await fetch('/api/delete-user', {
        method: 'DELETE', // ✅ Correct HTTP Method
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }), // ✅ Correct JSON Payload
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to delete user')
      }

      // ✅ Remove deleted user from UI
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  if (loading) {
    return <div>Loading users...</div>
  }

  return (
    <div className="p-4 rounded max-w-md">
      <h2 className="text-lg font-bold mb-3">Users</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="flex justify-between p-2 border rounded">
            <span>
              {user.firstName} {user.lastName} -{' '}
              {user.emailAddresses[0]?.emailAddress}
            </span>
            <button
              onClick={() => deleteUser(user.id)}
              className="p-2 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
