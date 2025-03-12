import { currentUser, clerkClient } from '@clerk/nextjs/server'
import Users from '../components/Users'

export const metadata = {
  title: `Dashboard`,
  description: '',
}

export default async function Page() {
  const user = await currentUser()
  const client = await clerkClient()
  const { data: userList } = await client.users.getUserList()
  console.log('CURRENT USER', user)
  console.log('USER LIST', userList)
  return (
    <div className="container">
      Hi {user?.firstName}
      <Users />
      {/* <ul className="space-y-2">
        {userList.map((user) => (
          <li key={user.id} className="flex justify-between p-2">
            <span>
              {user.firstName} {user.lastName} -{' '}
              {user.emailAddresses[0]?.emailAddress}
            </span>
          </li>
        ))}
      </ul> */}
    </div>
  )
}
