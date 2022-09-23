import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { withTRPC } from '@trpc/next'
import type { AppType } from 'next/dist/shared/lib/utils'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import superjson from 'superjson'
import type { AppRouter } from '../server/router'
import '../styles/globals.css'

const App: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Toaster />
      <div>
        <Head>
          <title>NewWeb</title>

          <meta
            name='description'
            content='neweb.io - blogging site (best)'
          />

          <link
            rel='icon'
            href='/favicon.png'
          />
        </Head>

        <Component {...pageProps} />
      </div>
    </>
  )
}

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '' // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

export default withTRPC<AppRouter>({
  config() {
    const url = `${getBaseUrl()}/api/trpc`

    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error)
        }),
        httpBatchLink({ url })
      ],
      url,
      transformer: superjson
    }
  },
  ssr: false
})(App)
