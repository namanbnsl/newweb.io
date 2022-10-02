import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import Navbar from '../components/Navbar'
import { trpc } from '../utils/trpc'
import { Blog } from '@prisma/client'
import toast from 'react-hot-toast'
import Link from 'next/link'

const YourPage: NextPage = () => {
  const { account, accountFound, connectWallet, error } = useAuth()

  const getYourBlogsQuery = trpc.useQuery([
    'blogs.findForUser',
    { address: account && accountFound ? account : '' }
  ])

  const [blogs, setBlogs] = useState<Array<Blog>>()

  useEffect(() => {
    if (
      getYourBlogsQuery.data &&
      !getYourBlogsQuery.isLoading &&
      !getYourBlogsQuery.isError
    ) {
      setBlogs(getYourBlogsQuery.data)
    }

    if (error) {
      toast.error('Make Sure You Have A Wallet!')
    }
  }, [getYourBlogsQuery])

  if (account && accountFound) {
    return (
      <>
        <Navbar />

        <div className='flex flex-col mt-12 max-w-6xl mx-auto'>
          {blogs?.length ? (
            <>
              {blogs?.map((blog) => (
                <Link href={`/post/${blog.id}`}>
                  <div
                    className='p-10 bg-slate-50 m-10 rounded-xl cursor-pointer hover:bg-slate-100'
                    key={blog.id}
                  >
                    <span className='font-bold'>Name:</span> {blog.title}
                    <div className='flex justify-end'>
                      <span className='font-bold mr-1'>By:</span>
                      {blog.writerAddress === account
                        ? 'You'
                        : blog.writerAddress}
                    </div>
                    <div className='flex justify-end mt-2'>
                      <span className='font-bold mr-1'>Is For Pro's:</span>
                      {blog.isBlogForPros ? 'Yes' : 'No'}
                    </div>
                    <span className='font-bold'>
                      Your Earnings From This Blog:
                    </span>{' '}
                    {blog.tipsCollected}
                  </div>
                </Link>
              ))}
            </>
          ) : (
            <div className='flex flex-col justify-center items-center'>
              <h1 className='mt-60 text-4xl'>
                You Have Not{' '}
                <span className='font-bold underline'>Created</span> Anything!
              </h1>

              <Link href={'/create'}>
                <a className='text-gray-700 hover:text-red-400 cursor-pointer mt-16 text-xl underline'>
                  Create Now
                </a>
              </Link>
            </div>
          )}
        </div>
      </>
    )
  }

  return (
    <div className='flex flex-col w-screen h-screen items-center justify-center'>
      <button
        onClick={() => connectWallet()}
        className='bg-red-400 text-white px-32 text-md duration-300 transition-all py-5 border-4 rounded-lg hover:bg-transparent hover:text-gray-700 border-red-400'
      >
        Connect
      </button>
    </div>
  )
}

export default YourPage
