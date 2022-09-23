import Link from 'next/link'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import useAuth from '../../hooks/useAuth'

const Navbar = () => {
  const { connectWallet, account, accountFound, switchAccount, error } =
    useAuth()

  useEffect(() => {
    if (error) {
      toast.error('Make Sure You Have A Wallet!')
    }
  }, [error])

  return (
    <nav className='mt-16'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex justify-between items-center'>
          <div className='flex'>
            <div>
              <Link href={'/'}>
                <a className='flex items-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6 mr-1'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
                    />
                  </svg>

                  <span className='font-bold hover:text-red-400'>
                    newweb.io
                  </span>
                </a>
              </Link>
            </div>
          </div>

          <div className='flex items-center'>
            <Link href={'/'}>
              <a className='underline hover:text-red-400 font-medium mr-16 flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-6 mr-1'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
                  />
                </svg>

                <span>Home</span>
              </a>
            </Link>

            {account && accountFound ? (
              <Link href={'/pro'}>
                <a className='underline hover:text-red-400 font-medium mr-16 flex items-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6 mr-1'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z'
                    />
                  </svg>
                  <span>Pro Subscription</span>
                </a>
              </Link>
            ) : null}

            {!account && accountFound ? (
              <button
                onClick={() => connectWallet()}
                className='bg-red-400 text-white px-32 text-md duration-300 transition-all py-5 border-4 rounded-lg hover:bg-transparent hover:text-gray-700 border-red-400'
              >
                Connect
              </button>
            ) : (
              <span
                onClick={() => switchAccount()}
                className='font-bold underline hover:text-red-400 cursor-pointer'
              >
                {account}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
