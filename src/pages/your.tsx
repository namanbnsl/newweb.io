import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import Navbar from '../components/Navbar'
import { trpc } from '../utils/trpc'
import { Blog, Transfer } from '@prisma/client'
import toast from 'react-hot-toast'
import Link from 'next/link'

const YourPage: NextPage = () => {
  const { account, accountFound, connectWallet, error } = useAuth()

  const getYourBlogsQuery = trpc.useQuery([
    'blogs.findForUser',
    { address: account && accountFound ? account : '' }
  ])

  const getYourTransfers = trpc.useQuery([
    'tips.getTransferForUser',
    { address: account && accountFound ? account : '' }
  ])

  const [blogs, setBlogs] = useState<Array<Blog>>()
  const [transfers, setTransfers] = useState<Array<Transfer>>()

  const [earnedMost, setEarnedMost] = useState<{
    name: string
    link: string
    value: number
    isForPros: boolean
  }>({
    name: '',
    link: '',
    value: 0,
    isForPros: false
  })

  const [mostTipper, setMostTipper] = useState<{
    address: string
    value: number
  }>({
    address: '',
    value: 0
  })

  useEffect(() => {
    if (
      getYourBlogsQuery.data &&
      !getYourBlogsQuery.isLoading &&
      !getYourBlogsQuery.isError
    ) {
      setBlogs(getYourBlogsQuery.data)
    }

    if (
      getYourTransfers.data &&
      !getYourTransfers.isLoading &&
      !getYourTransfers.isError
    ) {
      setTransfers(getYourTransfers.data)
    }

    if (error) {
      toast.error('Make Sure You Have A Wallet!')
    }

    blogs?.map((blog) => {
      if (parseFloat(blog.tipsCollected) > earnedMost.value) {
        setEarnedMost({
          name: blog.title,
          link: `/post/${blog.id}`,
          value: parseFloat(blog.tipsCollected),
          isForPros: blog.isBlogForPros
        })
      }
    })

    transfers?.map((transfer) => {
      if (parseFloat(transfer.value) + mostTipper.value > mostTipper.value) {
        setMostTipper({
          address: transfer.from,
          value: parseFloat(transfer.value) + mostTipper.value
        })
      }
    })
  }, [getYourBlogsQuery, earnedMost, getYourTransfers, mostTipper])

  if (account && accountFound) {
    return (
      <>
        <Navbar />

        <div className='flex flex-col mt-12 max-w-6xl mx-auto'>
          <h1 className='text-3xl font-bold mt-6'>Summary: </h1>
          <div className='flex mt-6'>
            <span className='font-bold mr-1'>Blog Tipped The Most:</span>{' '}
            <Link href={earnedMost.link}>
              <a className='underline hover:text-red-400'>{earnedMost.name}</a>
            </Link>
          </div>

          <div className='flex mt-6'>
            <span className='font-bold mr-1'>Blog Tipped The Most Value: </span>{' '}
            <span className='underline'>{earnedMost.value}</span>
          </div>

          <div className='flex mt-6'>
            <span className='font-bold mr-1'>
              Blog Tipped The Most Is For Pro's:{' '}
            </span>{' '}
            <span className='underline'>
              {earnedMost.isForPros ? 'Yes' : 'No'}
            </span>
          </div>

          <div className='flex mt-6'>
            <span className='font-bold mr-1'>Tipped Most By: </span>{' '}
            <span className='underline'>
              {mostTipper.address.toLowerCase()}
            </span>
          </div>

          {blogs?.length ? (
            <>
              {blogs?.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/post/${blog.id}`}
                >
                  <div className='p-10 bg-slate-50 m-10 rounded-xl cursor-pointer hover:bg-slate-100'>
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
