import { createRouter } from './context'
import { z } from 'zod'
import { prisma } from '../db/client'

const userRouter = createRouter()
  .mutation('createUser', {
    input: z.object({
      address: z.string()
    }),
    async resolve({ input }) {
      await prisma.user.create({
        data: {
          address: input.address,
          isPro: false,
          earnings: 0,
          totalEarnings: 0
        }
      })

      return 'User Created'
    }
  })
  .query('getIdByAddress', {
    input: z.object({
      address: z.string()
    }),
    async resolve({ input }) {
      const data = await prisma.user.findUnique({
        where: {
          address: input.address
        },
        select: {
          id: true
        }
      })

      return data
    }
  })
  .query('isPro', {
    input: z.object({
      address: z.string()
    }),
    async resolve({ input }) {
      const data = await prisma.user.findUnique({
        where: {
          address: input.address
        },
        select: {
          isPro: true
        }
      })

      return data
    }
  })
  .mutation('isProNow', {
    input: z.object({ id: z.string() }),
    async resolve({ input }) {
      await prisma.user.update({
        where: {
          id: input.id
        },
        data: {
          isPro: true
        }
      })
    }
  })

export default userRouter
