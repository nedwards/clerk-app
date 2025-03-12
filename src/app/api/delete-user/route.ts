import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function DELETE(req: Request) {
  try {
    const client = await clerkClient()
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User id is required' },
        { status: 400 }
      )
    }

    const user = await client.users.deleteUser(userId)

    return NextResponse.json({ message: 'User deleted', user })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Error deleting user' }, { status: 500 })
  }
}
