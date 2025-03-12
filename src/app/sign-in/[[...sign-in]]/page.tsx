'use client'

// import React from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

export default function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>()

  // Handle the submission of the sign-in form
  const onSubmit = async (data: { email: string; password: string }) => {
    if (!isLoaded) return

    try {
      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.push('/')
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: unknown) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <>
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Enter email address</label>
          <input
            {...register('email', { required: 'Email is required' })}
            id="email"
            name="email"
            type="email"
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password">Enter password</label>
          <input
            {...register('password', { required: 'Password is required' })}
            id="password"
            name="password"
            type="password"
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <button type="submit">Sign in</button>
      </form>
    </>
  )
}
