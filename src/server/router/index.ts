import { createRouter } from './context'
import superjson from 'superjson'
import userRouter from './user'
import blogRouter from './blogs'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('user.', userRouter)
  .merge('blogs.', blogRouter)

export type AppRouter = typeof appRouter
