import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const client = await clerkClient()
    const { firstName, lastName, emailAddress, password } = await req.json()

    if (!firstName || !lastName || !emailAddress || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await client.users.createUser({
      firstName,
      lastName,
      emailAddress: [emailAddress],
      password,
    })

    return NextResponse.json({ message: 'User created', user })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 })
  }
}
