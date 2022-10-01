import { createRouter } from './context'
import { prisma } from '../db/client'
import { z } from 'zod'

const tipRouter = createRouter()
  .mutation('updateTotalEarnings', {
    input: z.object({ valueToBeAdded: z.number(), address: z.string() }),
    async resolve({ input }) {
      const currentEarning = await prisma.user.findUnique({
        where: {
          address: input.address
        },
        select: {
          totalEarnings: true
        }
      })

      await prisma.user.update({
        where: {
          address: input.address
        },
        data: {
          totalEarnings:
            (currentEarning?.totalEarnings as number) + input.valueToBeAdded
        }
      })
    }
  })
  .mutation('editEarnings', {
    input: z.object({ valueToBeAdded: z.number(), address: z.string() }),
    async resolve({ input }) {
      const currentEarning = await prisma.user.findUnique({
        where: {
          address: input.address
        },
        select: {
          earnings: true
        }
      })

      await prisma.user.update({
        where: {
          address: input.address
        },
        data: {
          earnings: (currentEarning?.earnings as number) + input.valueToBeAdded
        }
      })
    }
  })
  .query('getEarnings', {
    input: z.object({
      address: z.string()
    }),
    async resolve({ input }) {
      const earning = await prisma.user.findUnique({
        where: {
          address: input.address
        },
        select: {
          earnings: true
        }
      })

      return earning?.earnings
    }
  })
  .mutation('setEarningsToZero', {
    input: z.object({ address: z.string() }),
    async resolve({ input }) {
      await prisma.user.update({
        where: {
          address: input.address
        },
        data: {
          earnings: 0
        }
      })

      return 'Success ✅'
    }
  })
  .query('getTotalEarnings', {
    input: z.object({
      address: z.string()
    }),
    async resolve({ input }) {
      const earning = await prisma.user.findUnique({
        where: {
          address: input.address
        },
        select: {
          totalEarnings: true
        }
      })

      return earning?.totalEarnings
    }
  })

export default tipRouter
