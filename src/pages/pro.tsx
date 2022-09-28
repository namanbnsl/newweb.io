import type { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import useTransfer from '../../hooks/useTransfer'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import { trpc } from '../utils/trpc'

const ProPage: NextPage = () => {
  const { sendToOwner, tip, isEthereum, sendToOwnerLoading, tipLoading } =
    useTransfer()
  const { account, accountFound, connectWallet } = useAuth()

  const [isPro, setIsPro] = useState<boolean>()

  const [tipState, setTipState] = useState('')

  const isProQuery = trpc.useQuery([
    'user.isPro',
    { address: account as string }
  ])

  useEffect(() => {
    console.log(isProQuery.data)

    if (
      isProQuery.data &&
      !isProQuery.isLoading &&
      !isProQuery.isError &&
      isProQuery.data?.isPro
    ) {
      setIsPro(true)
    }
  }, [isProQuery])

  if (isEthereum) {
    if (account && accountFound && sendToOwnerLoading) return <Loading />
  }

  if (isEthereum) {
    if (account && accountFound && tipLoading) return <Loading />
  }

  if (isEthereum) {
    if (account && accountFound) {
      if (isPro)
        return (
          <>
            <Navbar />

            <div className='flex flex-col justify-center items-center w-screen mt-80'>
              <h1 className='text-4xl'>
                You Already Have{' '}
                <span className='font-bold underline'>Pro</span> Subscription
              </h1>

              <span className='text-xl font-bold mt-24'>
                Tip (In MATIC):{' '}
                <input
                  onChange={(event) => setTipState(event.target.value)}
                  type='text'
                  placeholder='Tip'
                  className='px-5 ml-2 rounded-lg py-3 font-normal outline-none focus:border-red-200 border-4 border-gray-100'
                />
              </span>

              <button
                onClick={() => {
                  console.log(tipState)

                  if (tipState && parseFloat(tipState) !== 0) {
                    const totalPrice: number = parseFloat(tipState)

                    tip(totalPrice.toString())
                  }
                }}
                className='bg-red-400 text-white px-32 text-md duration-300 transition-all py-5 border-4 rounded-lg hover:bg-transparent hover:text-gray-700 border-red-400 mt-16'
              >
                Transact
              </button>
            </div>
          </>
        )

      return (
        <>
          <Navbar />

          <div className='flex flex-col justify-center items-center'>
            <h1 className='mt-48 text-4xl'>
              Buy A <span className='font-bold underline'>Pro</span>{' '}
              Subscription (One Time Payment)
            </h1>

            <div className='mt-48 flex flex-col gap-y-16'>
              <span className='text-xl font-bold'>
                Amount: <span className='font-normal'>1 MATIC</span>
              </span>

              <span className='text-xl font-bold'>
                Tip (In MATIC):{' '}
                <input
                  onChange={(event) => {
                    setTipState(event.target.value)
                  }}
                  type='text'
                  placeholder='Tip'
                  className='px-5 ml-2 rounded-lg py-3 font-normal outline-none focus:border-red-200 border-4 border-gray-100'
                />
              </span>

              <button
                onClick={() => {
                  console.log(tipState)

                  if (tipState && parseFloat(tipState) !== 0) {
                    const tip: number = parseFloat(tipState)
                    const totalPrice: number = 1 + tip

                    sendToOwner(totalPrice.toString())
                  } else {
                    const totalPrice: number = 1

                    sendToOwner(totalPrice.toString())
                  }
                }}
                className='bg-red-400 text-white px-32 text-md duration-300 transition-all py-5 border-4 rounded-lg hover:bg-transparent hover:text-gray-700 border-red-400'
              >
                Transact
              </button>
            </div>
          </div>
        </>
      )
    }
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
export default ProPage
