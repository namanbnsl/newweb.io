import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { trpc } from '../src/utils/trpc'
import useAuth from './useAuth'
import useTransfer from './useTransfer'

const useTip = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ethereum = typeof window !== 'undefined' && (window as any).ethereum

  const [isEthereum, setIsEthereum] = useState<boolean>(false)

  let provider
  let signer: any

  const editEarningsMutation = trpc.useMutation(['tips.editEarnings'])

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

  const editTipMutation = trpc.useMutation(['blogs.addTipsCollected'])
  const editTotalTipMutation = trpc.useMutation(['tips.updateTotalEarnings'])

  const createTransferMutation = trpc.useMutation(['tips.createTransaction'])

  const tipCreator = async (address: string, value: string, blogId: string) => {
    try {
      const addressOwner = '0x99a324a4491f432c6FEc08AF3BB4399dcBAA5096'

      setTipCreatorLoading(true)

      const tx = await signer.sendTransaction({
        to: addressOwner,
        value: ethers.utils.parseEther(value)
      })

      const reciept = await tx.wait()

      setTipCreatorLoading(false)

      editEarningsMutation.mutate({
        address: address,
        valueToBeAdded: (parseFloat(value) * 1) / 2
      })

      const valueToTip = (parseFloat(value) * 1) / 2

      editTipMutation.mutate({
        id: blogId,
        valueToAdd: valueToTip.toString()
      })

      editTotalTipMutation.mutate({
        address: address,
        valueToBeAdded: valueToTip
      })

      createTransferMutation.mutate({
        from: reciept.from,
        to: address,
        date: new Date(),
        value: valueToTip.toString(),
        link: `https://mumbai.polygonscan.com/tx/${reciept.transactionHash}`
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
