import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { trpc } from '../src/utils/trpc'
import useAuth from './useAuth'
import useTransfer from './useTransfer'

import { abi } from '../backend/artifacts/contracts/CreateNft.sol/CreateNFT.json'

const useRoyalty = () => {
  const setSellMut = trpc.useMutation(['royalty.setSell'])
  const buyMut = trpc.useMutation(['royalty.buy'])

  const updateEarningsMut = trpc.useMutation(['tips.editEarnings'])
  const updateTotalEarningsMut = trpc.useMutation(['tips.updateTotalEarnings'])

  const { sendToOwnerJust } = useTransfer()
  const { account, accountFound } = useAuth()

  const [buyLoading, setLoading] = useState<boolean>()

  const router = useRouter()

  const ethereum = typeof window !== 'undefined' && (window as any).ethereum

  let provider: any
  let signer: any

  if (ethereum) {
    provider = new ethers.providers.Web3Provider(ethereum)
    signer = provider.getSigner()
  }

  const sell = async (blogId: string, sellAmount: string) => {
    if (sellAmount && parseFloat(sellAmount) !== 0) {
      await setSellMut.mutateAsync({
        sell: true,
        blogId: blogId,
        sellAmount: parseFloat(sellAmount)
      })

      toast.success('Item Listed For Selling!')
    } else {
      toast.error('Sell Amount Cannot Be 0')
    }

    router.reload()
  }

  const updateTokenCounter = trpc.useMutation(['blogs.updateTokenCounter'])

  const buy = async (
    blogId: string,
    sellAmount: string,
    oAddress: string,
    blogOwner: string,
    tokenUri: string
  ) => {
    if (sellAmount && parseFloat(sellAmount) !== 0) {
      setLoading(true)

      if (oAddress === blogOwner) {
        await sendToOwnerJust(
          sellAmount,
          blogId,
          blogOwner,
          oAddress,
          sellAmount,
          true
        )
      } else {
        await sendToOwnerJust(
          sellAmount,
          blogId,
          blogOwner,
          oAddress,
          sellAmount,
          false
        )
      }

      if (oAddress === blogOwner) {
        const myContract = new ethers.Contract(
          '0xC1c10366412Dc6A7dfbcD377a6A8787504A667b3',
          abi,
          signer
        )

        const mintToken = await myContract.mintNft(tokenUri)
        const mintNftReciept = await mintToken.wait()

        await updateTokenCounter.mutateAsync()

        await updateEarningsMut.mutateAsync({
          address: oAddress,
          valueToBeAdded: parseFloat(sellAmount)
        })

        await updateTotalEarningsMut.mutateAsync({
          address: oAddress,
          valueToBeAdded: parseFloat(sellAmount)
        })

        await buyMut.mutateAsync({
          amount: parseFloat(sellAmount),
          blogId: blogId,
          newAddress: account && accountFound ? account : ''
        })
      } else {
        const myContract = new ethers.Contract(
          '0xC1c10366412Dc6A7dfbcD377a6A8787504A667b3',
          abi,
          signer
        )

        const mintToken = await myContract.mintNft(tokenUri)
        const mintNftReciept = await mintToken.wait()

        await updateTokenCounter.mutateAsync()

        await updateEarningsMut.mutateAsync({
          address: oAddress,
          valueToBeAdded: (parseFloat(sellAmount) * 1) / 10
        })

        await updateTotalEarningsMut.mutateAsync({
          address: oAddress,
          valueToBeAdded: (parseFloat(sellAmount) * 1) / 10
        })

        await updateEarningsMut.mutateAsync({
          address: blogOwner,
          valueToBeAdded: (parseFloat(sellAmount) * 9) / 10
        })

        await updateTotalEarningsMut.mutateAsync({
          address: oAddress,
          valueToBeAdded: parseFloat(sellAmount)
        })

        await buyMut.mutateAsync({
          amount: parseFloat(sellAmount),
          blogId: blogId,
          newAddress: account && accountFound ? account : ''
        })
      }

      setLoading(false)

      router.reload()

      toast.success('Item Bought!')
    } else {
      toast.error('There Was An Error!')
    }
  }

  return { sell, buy, buyLoading }
}

export default useRoyalty
