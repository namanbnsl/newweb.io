import { createRouter } from './context'
import superjson from 'superjson'
import userRouter from './user'
import blogRouter from './blogs'
import tipRouter from './tip'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('user.', userRouter)
  .merge('blogs.', blogRouter)
  .merge('tips.', tipRouter)

export type AppRouter = typeof appRouter
