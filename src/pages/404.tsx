import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const NotFoundPage: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    setInterval(() => {
      router.push('/')
    }, 3000)
  }, [])

  return (
    <div className='flex flex-col w-screen h-screen justify-center items-center'>
      <span className='text-4xl'>
        <span className='font-bold underline'>Ooops.</span> Page Not Found!
      </span>

      <Link href={'/'}>
        <a className='mt-6 text-lg hover:text-red-400'>
          We will redirect you to the {''}
          <span className='font-bold underline'>Home Page</span> in 3 seconds.
        </a>
      </Link>
    </div>
  )
}

export default NotFoundPage
