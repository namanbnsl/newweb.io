import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { trpc } from '../src/utils/trpc'
import useAuth from './useAuth'

const useTransfer = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ethereum = typeof window !== 'undefined' && (window as any).ethereum

  const [link, setLink] = useState<string>('')

  const [isEthereum, setIsEthereum] = useState<boolean>(false)

  const setEarningsToZero = trpc.useMutation(['tips.setEarningsToZero'])

  const router = useRouter()

  let provider: any
  let signer: any

  const { account, accountFound } = useAuth()

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

  const proMutation = trpc.useMutation(['user.isProNow'])
  const getIdQuery = trpc.useQuery([
    'user.getIdByAddress',
    { address: account as string }
  ])

  const sendToOwnerTip = async (value: string) => {
    const tx = await signer.sendTransaction({
      to: address,
      value: ethers.utils.parseEther(value)
    })
  }

  const [sendToOwnerLoading, setSendToOwnerLoading] = useState<boolean>(false)

  const sendToOwner = async (value: string) => {
    try {
      const addressOwner = '0x99a324a4491f432c6FEc08AF3BB4399dcBAA5096'

      setSendToOwnerLoading(true)

      const tx = await signer.sendTransaction({
        to: addressOwner,
        value: ethers.utils.parseEther(value)
      })

      const reciept = await tx.wait()

      if (getIdQuery.data) {
        const id = getIdQuery.data?.id

        proMutation.mutate({ id: id as string })
      }

      setSendToOwnerLoading(false)

      router.push('/')

      toast.success('Pro Subscription Has Been Bought!')
    } catch (err: any) {
      setSendToOwnerLoading(false)

      console.log(err)

      toast.error('There Was An Error!')
    }
  }

  const createTransMut = trpc.useMutation(['tips.createTransaction'])

  const sendToOwnerJust = async (
    value: string,
    blogId: string,
    blogOwner: string,
    blogOOwner: string,
    amount: string,
    isOOwner: boolean
  ) => {
    try {
      const addressOwner = '0x99a324a4491f432c6FEc08AF3BB4399dcBAA5096'

      const tx = await signer.sendTransaction({
        to: addressOwner,
        value: ethers.utils.parseEther(value)
      })

      const reciept = await tx.wait()

      if (isOOwner) {
        createTransMut.mutate({
          blogId: blogId,
          date: new Date(),
          from: account && accountFound ? account : '',
          to: blogOwner,
          link: `https://mumbai.polygonscan.com/tx/${reciept.transactionHash}`,
          value: amount
        })
      } else {
        createTransMut.mutate({
          blogId: blogId,
          date: new Date(),
          from: account && accountFound ? account : '',
          to: blogOOwner,
          link: `https://mumbai.polygonscan.com/tx/${reciept.transactionHash}`,
          value: ((parseFloat(amount) * 1) / 10).toString()
        })

        createTransMut.mutate({
          blogId: blogId,
          date: new Date(),
          from: account && accountFound ? account : '',
          to: blogOwner,
          link: `https://mumbai.polygonscan.com/tx/${reciept.transactionHash}`,
          value: ((parseFloat(amount) * 9) / 10).toString()
        })
      }
    } catch (err: any) {
      toast.error('There Was An Error!')
    }
  }

  const [tipLoading, setTipLoading] = useState<boolean>(false)

  const tip = async (value: string) => {
    try {
      setTipLoading(true)

      const tx = await signer.sendTransaction({
        to: address,
        value: ethers.utils.parseEther(value)
      })

      const reciept = await tx.wait()

      setTipLoading(false)

      router.push('/')

      toast.success('Tip Has Been Sent!')
    } catch (err) {
      setTipLoading(false)

      toast.error('There Was An Error!')
    }
  }

  const [withdrawLoading, setWithdrawLoading] = useState<boolean>()
  const [withdrawTransactionDone, setWithdrawTransactionDone] =
    useState<boolean>(false)

  const withdraw = async (
    value: string,
    address: string,
    private_key: string
  ) => {
    const wallet = new ethers.Wallet(private_key as string)

    const provider = new ethers.providers.Web3Provider(ethereum)

    let gas_price

    provider.getGasPrice().then((currentGasPrice) => {
      gas_price = ethers.utils.hexlify(parseInt(currentGasPrice.toString()))
    })

    const walletSigner = wallet.connect(provider)

    const fromAddress = '0x99a324a4491f432c6FEc08AF3BB4399dcBAA5096'

    let gas_limit = '0x100000'

    const tx = {
      from: fromAddress,
      to: address,
      value: ethers.utils.parseEther(value),
      nonce: provider.getTransactionCount(fromAddress, 'latest'),
      gasLimit: ethers.utils.hexlify(gas_limit), // 100000
      gasPrice: gas_price
    }

    try {
      setEarningsToZero.mutate({
        address: account && accountFound ? account : ''
      })

      setWithdrawLoading(true)

      const sendTx = await walletSigner.sendTransaction(tx)

      const reciept = await sendTx.wait()

      setWithdrawLoading(false)

      setWithdrawTransactionDone(true)

      setLink(`https://mumbai.polygonscan.com/tx/${reciept.transactionHash}`)

      toast.success('Withdraw was sucessful')
    } catch (error) {
      setWithdrawLoading(false)

      toast.error('There Was An Error!')
    }
  }

  return {
    sendToOwner,
    tip,
    isEthereum,
    sendToOwnerTip,
    withdraw,
    link,
    withdrawLoading,
    withdrawTransactionDone,
    sendToOwnerLoading,
    tipLoading,
    sendToOwnerJust
  }
}

export default useTransfer
