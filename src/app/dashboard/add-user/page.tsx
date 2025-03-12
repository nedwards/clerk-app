import { clerkClient } from '@clerk/nextjs/server'

import NewUser from '../../components/newUser'

export const metadata = {
  title: `Add user`,
  description: '',
}

export default async function Page() {
  const client = await clerkClient()
  const { data: userList } = await client.users.getUserList()
  console.log('USER LIST', userList)
  return (
    <>
      <NewUser />
    </>
  )
}
