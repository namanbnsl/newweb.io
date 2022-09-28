import ReactLoading from 'react-loading'

const Loading: React.FC = () => {
  return (
    <div className='flex flex-col w-screen h-screen justify-center items-center'>
      <ReactLoading
        color='#f87171'
        type='spin'
      />

      <span className='mt-4'>Your Transaction Is Happening...</span>
    </div>
  )
}

export default Loading
