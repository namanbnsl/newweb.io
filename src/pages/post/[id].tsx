import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import Navbar from '../../components/Navbar'
import { trpc } from '../../utils/trpc'

const PostPage: NextPage = () => {
  const { account, accountFound, connectWallet } = useAuth()

  const router = useRouter()

  const { id } = router.query

  const findQuery = trpc.useQuery(['blogs.findById', { id: id as string }])

  const [title, setTitle] = useState<string>()
  const [content, setContent] = useState<string>()

  useEffect(() => {
    if (findQuery && !findQuery.isError && !findQuery.isLoading) {
      setTitle(findQuery.data?.title)
      setContent(findQuery.data?.content)
    }
  }, [findQuery])

  if (account && accountFound) {
    return (
      <>
        <Navbar />

        <div className='flex flex-col justify-center items-center'>
          <span className='flex mt-48 text-2xl'>
            <span className='font-bold'>Title: </span>
            <h1 className='ml-2 underline'>{title}</h1>
          </span>

          <div className='mt-16 text-2xl'>
            {content ? content : 'No Content'}
          </div>
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

export default PostPage
