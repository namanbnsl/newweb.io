import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import useAuth from '../../hooks/useAuth'
import Navbar from '../components/Navbar'
import { trpc } from '../utils/trpc'

const CreatePage: NextPage = () => {
  const { account, accountFound, connectWallet } = useAuth()

  const [shouldShow, setShouldShow] = useState<boolean>()
  const [isChecked, setIsChecked] = useState<boolean>(false)

  const createPostMutation = trpc.useMutation(['blogs.createBlog'])

  const router = useRouter()

  const handleOnChange = () => {
    setIsChecked(!isChecked)
  }

  const titleRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (account && accountFound) {
      setShouldShow(true)
    } else {
      setShouldShow(false)
    }
  })

  if (shouldShow)
    return (
      <>
        <Navbar />

        <div className='flex flex-col justify-center items-center'>
          <h1 className='mt-48 text-4xl'>
            Create A <span className='font-bold underline'>newweb.io</span> Post
          </h1>

          <span className='text-xl font-bold mt-24'>
            Title:{' '}
            <input
              type='text'
              ref={titleRef}
              placeholder='Title'
              className='px-5 ml-2 rounded-lg py-3 font-normal outline-none focus:border-red-200 border-4 border-gray-100'
            />
          </span>

          <span className='text-xl font-bold mt-24'>
            <textarea
              ref={contentRef}
              cols={100}
              rows={10}
              placeholder='Description'
              className='px-5 ml-2 rounded-lg py-3 font-normal outline-none focus:border-red-200 border-4 border-gray-100'
            />
          </span>

          <div className='flex gap-x-6'>
            {isChecked ? (
              <button
                onClick={() => {
                  handleOnChange()
                }}
                className='bg-red-400 mt-16 text-white px-32 text-md duration-300 transition-all py-5 border-4 rounded-lg hover:bg-transparent hover:text-gray-700 border-red-400'
              >
                Is For Pros
              </button>
            ) : (
              <button
                onClick={() => {
                  handleOnChange()
                }}
                className='bg-gray-100 mt-16 text-black px-32 text-md duration-300 transition-all py-5 border-4 rounded-lg hover:bg-transparent hover:text-gray-700 border-gray-100'
              >
                Is For Pros
              </button>
            )}

            <button
              onClick={() => {
                try {
                  if (account && accountFound) {
                    createPostMutation.mutate({
                      address: account,
                      content: contentRef.current?.value as string,
                      title: titleRef.current?.value as string,
                      isBlogForPros: isChecked as boolean
                    })

                    toast.success('Blog Created!')

                    router.push('/')
                  }
                } catch (err) {
                  toast.error('There Was An Error!')
                }
              }}
              className='bg-red-400 mt-16 text-white px-32 text-md duration-300 transition-all py-5 border-4 rounded-lg hover:bg-transparent hover:text-gray-700 border-red-400'
            >
              Submit
            </button>
          </div>
        </div>
      </>
    )

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

export default CreatePage
