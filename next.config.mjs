import { env } from './src/env/server.mjs'

/**
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config
}

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en'],
    defaultLocale: 'en'
  },
  env: {
    BASE_URL: process.env.BASE_URL
  }
})
