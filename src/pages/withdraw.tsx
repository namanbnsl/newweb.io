import type { NextPage } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import useTransfer from '../../hooks/useTransfer'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import { trpc } from '../utils/trpc'

interface Props {
  private_key: string
}

const WithdrawPage: NextPage<Props> = (props: Props) => {
  const { account, accountFound, connectWallet } = useAuth()
  const { withdraw, link, withdrawLoading, withdrawTransactionDone } =
    useTransfer()

  const getEarnings = trpc.useQuery([
    'tips.getEarnings',
    { address: account && accountFound ? account : '' }
  ])

  const getTotalEarnings = trpc.useQuery([
    'tips.getTotalEarnings',
    { address: account && accountFound ? account : '' }
  ])

  if (account && accountFound && withdrawLoading) return <Loading />

  if (account && accountFound) {
    return (
      <>
        <Navbar />

        {!withdrawTransactionDone && (
          <div className='flex flex-col justify-center items-center'>
            <h1 className='mt-48 text-4xl'>
              You Have Earned {getEarnings.data} MATIC
            </h1>

            {getEarnings.data !== 0 ? (
              <>
                <button
                  onClick={() => {
                    withdraw(
                      getEarnings.data?.toString() as string,
                      account as string,
                      props.private_key
                    )
                  }}
                  className='bg-red-400 mt-16 text-white px-32 text-md duration-300 transition-all py-5 border-4 rounded-lg hover:bg-transparent hover:text-gray-700 border-red-400'
                >
                  Withdraw {getEarnings.data} MATIC
                </button>
              </>
            ) : (
              <>
                <span className='px-32 text-xl mt-16 text-md duration-300 transition-all py-5 rounded-lg'>
                  Nothing To Withdraw
                </span>
              </>
            )}

            <span className='text-xl mt-16'>
              You Have Earned{' '}
              <span className='font-bold'>{getTotalEarnings.data}</span>
            </span>
          </div>
        )}

        <div className='flex flex-col justify-center items-center mt-60'>
          {link ? (
            <span className='mt-60 text-4xl'>
              Your Transaction link is{' '}
              <Link href={link}>
                <a className='text-red-400 underline'>This</a>
              </Link>
            </span>
          ) : null}
        </div>
      </>
    )
  }

  return (
    <div className='flex flex-col justify-center items-center w-screen h-screen'>
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
  const private_key = process.env.PRIVATE_KEY

  return {
    props: {
      private_key
    }
  }
}

export default WithdrawPage
