import { createRouter } from './context'
import { z } from 'zod'
import { prisma } from '../db/client'

const royaltyRouter = createRouter()
  .mutation('setSell', {
    input: z.object({
      sell: z.boolean(),
      blogId: z.string(),
      sellAmount: z.number()
    }),
    async resolve({ input }) {
      await prisma.blog.update({
        where: {
          id: input.blogId
        },
        data: {
          isSell: input.sell,
          sellAmount: input.sellAmount
        }
      })

      return 'Success ✅'
    }
  })
  .mutation('buy', {
    input: z.object({
      blogId: z.string(),
      newAddress: z.string(),
      amount: z.number()
    }),
    async resolve({ input }) {
      await prisma.blog.update({
        where: {
          id: input.blogId
        },
        data: {
          isSell: false,
          writer: {
            connect: {
              address: input.newAddress
            }
          },
          sellAmount: 0
        }
      })
    }
  })

export default royaltyRouter
