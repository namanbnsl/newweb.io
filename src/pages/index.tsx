import { Blog } from '@prisma/client'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import Navbar from '../components/Navbar'
import { trpc } from '../utils/trpc'

const Home: NextPage = () => {
  const { account } = useAuth()

  const [isPro, setIsPro] = useState<boolean>(false)

  const getAllQuery = trpc.useQuery(['blogs.getAll'])
  const isProQuery = trpc.useQuery([
    'user.isPro',
    { address: account as string }
  ])

  const [blogs, setBlogs] = useState<Array<Blog>>()

  useEffect(() => {
    if (getAllQuery.data && !getAllQuery.isLoading && !getAllQuery.isError) {
      setBlogs(getAllQuery.data)
    }

    if (
      isProQuery.data &&
      !isProQuery.isLoading &&
      !isProQuery.isError &&
      isProQuery.data[0]?.isPro
    ) {
      setIsPro(true)
    }
  }, [getAllQuery, isProQuery])

  console.log(blogs)

  return (
    <>
      <Navbar />

      <div className='flex flex-col mt-12 max-w-6xl mx-auto'>
        {isPro ? (
          <>
            {blogs?.map((blog) => (
              <div className='p-10 bg-slate-50 m-5 rounded-xl cursor-pointer hover:bg-white border-slate-50 border-4'>
                <span className='font-bold'>Name:</span> {blog.title}
                <span className='flex justify-end'>
                  By:{' '}
                  {blog.writerAddress === account ? 'You' : blog.writerAddress}
                </span>
              </div>
            ))}
          </>
        ) : (
          <>
            {blogs?.map((blog) => (
              <>
                {!blog.isBlogForPros && (
                  <div className='p-10 bg-slate-50 m-5 rounded-xl cursor-pointer hover:bg-white border-slate-50 border-4'>
                    <span className='font-bold'>Name:</span> {blog.title}
                    <span className='flex justify-end'>
                      By:{' '}
                      {blog.writerAddress === account
                        ? 'You'
                        : blog.writerAddress}
                    </span>
                  </div>
                )}
              </>
            ))}
          </>
        )}
      </div>
    </>
  )
}

export default Home
