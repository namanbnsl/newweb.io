import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { trpc } from '../src/utils/trpc'
import useTransfer from './useTransfer'

const useTip = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ethereum = typeof window !== 'undefined' && (window as any).ethereum

  const [isEthereum, setIsEthereum] = useState<boolean>(false)

  const router = useRouter()

  let provider
  let signer: any

  const editEarningsMutation = trpc.useMutation(['tips.editEarnings'])

  const { sendToOwnerTip } = useTransfer()

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

  const [tipCreatorLoading, setTipCreatorLoading] = useState<boolean>()

  const tipCreator = async (address: string, value: string) => {
    try {
      const addressOwner = '0x99a324a4491f432c6FEc08AF3BB4399dcBAA5096'

      setTipCreatorLoading(true)

      const tx = await signer.sendTransaction({
        to: addressOwner,
        value: ethers.utils.parseEther(((parseFloat(value) * 1) / 2).toString())
      })

      const reciept = await tx.wait()

      setTipCreatorLoading(false)

      editEarningsMutation.mutate({
        address: address,
        valueToBeAdded: (parseFloat(value) * 1) / 2
      })

      setTipCreatorLoading(false)

      toast.success('Tip Has Been Sent!')
    } catch (err: any) {
      setTipCreatorLoading(false)

      toast.error('There Was An Error!')
    }
  }

  return { tipCreator, isEthereum, tipCreatorLoading }
}

export default useTip
