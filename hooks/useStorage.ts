import { useRouter } from 'next/router'
import { Web3Storage } from 'web3.storage'

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

    console.log('CID: ', cid)

    router.push('/')
  }

  return { storeFiles }
}

export default useStorage
