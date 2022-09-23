import { createRouter } from './context'
import superjson from 'superjson'
import userRouter from './user'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('user.', userRouter)

export type AppRouter = typeof appRouter
