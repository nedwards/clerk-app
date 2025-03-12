import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// API Route to fetch users
export async function GET() {
  try {
    // Fetch users from Clerk
    const client = await clerkClient()
    const { data: users } = await client.users.getUserList()

    // Format response to ensure non-null names
    const formattedUsers = users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddresses: user.emailAddresses.map((email) => ({
        emailAddress: email.emailAddress,
      })),
    }))

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 })
  }
}
