import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { trpc } from '../src/utils/trpc'
import useAuth from './useAuth'

const useTransfer = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ethereum = typeof window !== 'undefined' && (window as any).ethereum

  const [isEthereum, setIsEthereum] = useState<boolean>(false)

  const router = useRouter()

  let provider
  let signer: any

  if (ethereum) {
    provider = new ethers.providers.Web3Provider(ethereum)
    signer = provider.getSigner()
  }

  useEffect(() => {
    if (ethereum) {
      setIsEthereum(true)
    } else {
      setIsEthereum(false)
    }
  }, [ethereum])

  const address = '0x99a324a4491f432c6FEc08AF3BB4399dcBAA5096'

  const { account } = useAuth()

  const proMutation = trpc.useMutation(['user.isProNow'])
  const getIdQuery = trpc.useQuery([
    'user.getIdByAddress',
    { address: account as string }
  ])

  const sendToOwner = async (value: string) => {
    try {
      const tx = await signer.sendTransaction({
        to: address,
        value: ethers.utils.parseEther(value)
      })

      tx.wait()

      if (getIdQuery.data) {
        const id = getIdQuery.data[0]?.id

        proMutation.mutate({ id: id as string })
      }

      toast.success('Pro Subscription Has Been Bought!')

      router.push('/')
    } catch (err: any) {
      toast.error('There Was An Error!')
    }
  }

  const tip = async (value: string) => {
    try {
      const tx = await signer.sendTransaction({
        to: address,
        value: ethers.utils.parseEther(value)
      })

      tx.wait()

      if (getIdQuery.data) {
        const id = getIdQuery.data[0]?.id

        proMutation.mutate({ id: id as string })
      }

      toast.success('Tip Has Been Sent!')

      router.push('/')
    } catch (err: any) {
      toast.error('There Was An Error!')
    }
  }

  return { sendToOwner, tip, isEthereum }
}

export default useTransfer
