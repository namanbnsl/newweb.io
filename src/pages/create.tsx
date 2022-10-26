import { router } from '@trpc/server'
import type { NextPage } from 'next'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import useAuth from '../../hooks/useAuth'
import useStorage from '../../hooks/useStorage'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'

interface Props {
  api_token: string
}

const CreatePage: NextPage<Props> = (props: Props) => {
  const { account, accountFound, connectWallet } = useAuth()

  const [shouldShow, setShouldShow] = useState<boolean>()
  const [isChecked, setIsChecked] = useState<boolean>(false)

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

  const [loading, setLoading] = useState<boolean>()

  const { createPost } = useStorage()

  if (account && accountFound && loading) return <Loading />

  const nftRef = useRef<any>()

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

          <div className='mt-4'>
            <span>File For NFT: </span>

            <input
              type='file'
              accept='image/png'
              ref={nftRef}
              required
            />
          </div>

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
                setLoading(true)

                try {
                  if (account && accountFound) {
                    createPost(
                      contentRef.current?.value as string,
                      titleRef.current?.value as string,
                      isChecked as boolean,
                      props.api_token,
                      nftRef
                    )
                  }
                } catch (err) {
                  toast.error('There Was An Error!')
                }

                setLoading(false)
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

export const getServerSideProps = (context: any) => {
  const api_token = process.env.API_TOKEN

  return {
    props: {
      api_token
    }
  }
}

export default CreatePage
