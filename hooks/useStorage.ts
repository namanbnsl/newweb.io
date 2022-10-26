import { useRouter } from 'next/router'
import { Web3Storage } from 'web3.storage'
import useAuth from './useAuth'
import { toast } from 'react-hot-toast'
import { trpc } from '../src/utils/trpc'
import { RefObject, useState } from 'react'
import { ethers } from 'ethers'

import { abi } from '../backend/artifacts/contracts/CreateNft.sol/CreateNFT.json'

const useStorage = () => {
  const router = useRouter()

  const makeFiles = (title: string, content: string) => {
    const obj = { title: title, content: content }

    const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })

    const files = [new File([blob], `${title}.json`)]

    return files
  }

  const storeFiles = async (
    api_token: string,
    title: string,
    content: string
  ) => {
    const client = new Web3Storage({ token: api_token })

    const cid = await client.put(makeFiles(title, content))

    router.push('/')
  }

  const ethereum = typeof window !== 'undefined' && (window as any).ethereum

  let provider: any
  let signer: any

  const { account, accountFound } = useAuth()

  if (ethereum) {
    provider = new ethers.providers.Web3Provider(ethereum)
    signer = provider.getSigner()
  }

  const createPostMutation = trpc.useMutation(['blogs.createBlog'])

  const createPost = async (
    content: string,
    title: string,
    isChecked: boolean,
    api_token: string,
    nftRef: RefObject<HTMLInputElement>
  ) => {
    try {
      if (account && accountFound) {
        const client = new Web3Storage({ token: api_token })

        if (
          nftRef.current?.files?.length &&
          nftRef.current.files.length > 0 &&
          title.length >= 2 &&
          content.length >= 5 &&
          nftRef?.current?.files &&
          nftRef.current.files[0] &&
          nftRef.current.files[0].type === 'image/png'
        ) {
          storeFiles(api_token, title, content)

          const cid = await client.put(nftRef.current.files)
          const res = await client.get(cid)

          if (!res!.ok) {
            throw new Error(`failed to get ${cid}`)
          }

          const files = await res!.files()

          let imageUri

          for (const file of files) {
            console.log('Started')

            imageUri = `https://${cid}.ipfs.dweb.link/${file.name}`

            const obj = { name: title, description: content, image: imageUri }

            const blob = new Blob([JSON.stringify(obj)], {
              type: 'application/json'
            })

            const filesNft = [new File([blob], `${title}NFT.json`)]

            const cidForImage = await client.put(filesNft)

            const myContract = new ethers.Contract(
              '0xC1c10366412Dc6A7dfbcD377a6A8787504A667b3',
              abi,
              signer
            )

            const res = await client.get(cidForImage)

            const filesForTokenUri = await res!.files()

            console.log('Done 1')

            for (const file of filesForTokenUri) {
              const tokenUri = `https://${cidForImage}.ipfs.dweb.link/${file.name}`

              console.log('Done 2')

              const mintToken = await myContract.mintNft(tokenUri)
              const mintNftReciept = await mintToken.wait()

              await createPostMutation.mutateAsync({
                address: account,
                content: content,
                title: title,
                isBlogForPros: isChecked,
                tokenUri: tokenUri
              })
            }
          }

          toast.success('Blog Created!')
        } else {
          toast.error('Fields Have Not Been Correctly Filled!')

          router.reload()
        }
      }
    } catch (err) {
      toast.error('There Was An Error!')
    }
  }

  return { storeFiles, createPost }
}

export default useStorage
