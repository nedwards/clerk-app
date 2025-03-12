'use client'

import React, { useState } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [verifying, setVerifying] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ emailAddress: string; password: string }>()

  const {
    register: registerVerify,
    handleSubmit: handleVerifySubmit,
    formState: { errors: verifyErrors },
  } = useForm<{ code: string }>()

  // Handle submission of the sign-up form
  const onSubmit = async (data: { emailAddress: string; password: string }) => {
    if (!isLoaded) return

    try {
      await signUp.create({
        emailAddress: data.emailAddress,
        password: data.password,
      })

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      })

      setVerifying(true)
    } catch (err: unknown) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle the submission of the verification form
  const onVerify = async (data: { code: string }) => {
    if (!isLoaded) return

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: data.code,
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.push('/')
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err: unknown) {
      console.error('Error:', JSON.stringify(err, null, 2))
    }
  }

  if (verifying) {
    return (
      <>
        <h1>Verify your email</h1>
        <form onSubmit={handleVerifySubmit(onVerify)}>
          <label htmlFor="code">Enter your verification code</label>
          <input
            {...registerVerify('code', {
              required: 'Verification code is required',
            })}
            id="code"
            name="code"
          />
          {verifyErrors.code && <p>{verifyErrors.code.message}</p>}
          <button type="submit">Verify</button>
        </form>
      </>
    )
  }

  return (
    <>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Enter email address</label>
          <input
            {...register('emailAddress', { required: 'Email is required' })}
            id="email"
            type="email"
            name="email"
          />
          {errors.emailAddress && <p>{errors.emailAddress.message}</p>}
        </div>
        <div>
          <label htmlFor="password">Enter password</label>
          <input
            {...register('password', { required: 'Password is required' })}
            id="password"
            type="password"
            name="password"
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <div>
          <button type="submit">Continue</button>
        </div>
      </form>
    </>
  )
}
