import { createRouter } from './context'
import { z } from 'zod'
import { prisma } from '../db/client'

const blogRouter = createRouter()
  .mutation('createBlog', {
    input: z.object({
      title: z.string(),
      content: z.string(),
      isBlogForPros: z.boolean(),
      address: z.string()
    }),
    async resolve({ input }) {
      await prisma.blog.create({
        data: {
          title: input.title,
          content: input.content,
          isBlogForPros: input.isBlogForPros,
          tipsCollected: '0',
          writer: {
            connect: {
              address: input.address
            }
          }
        }
      })

      return 'Success! ✅'
    }
  })
  .query('getAll', {
    async resolve() {
      const blogs = await prisma.blog.findMany({})

      return blogs
    }
  })
  .query('findForUser', {
    input: z.object({ address: z.string() }),
    async resolve({ input }) {
      const blogs = await prisma.blog.findMany({
        where: {
          writerAddress: input.address
        }
      })

      return blogs
    }
  })
  .query('findById', {
    input: z.object({ id: z.string() }),
    async resolve({ input }) {
      const data = await prisma.blog.findUnique({
        where: {
          id: input.id
        },
        select: {
          content: true,
          title: true
        }
      })

      return {
        title: data?.title,
        content: data?.content
      }
    }
  })
  .mutation('addTipsCollected', {
    input: z.object({ valueToAdd: z.string(), id: z.string() }),
    async resolve({ input }) {
      const tipsCollected = await prisma.blog.findUnique({
        where: {
          id: input.id
        },
        select: {
          tipsCollected: true
        }
      })

      const currentTip = tipsCollected?.tipsCollected

      const fullTip =
        parseFloat(currentTip as string) +
        parseFloat(input.valueToAdd as string)

      await prisma.blog.update({
        where: {
          id: input.id
        },
        data: {
          tipsCollected: fullTip.toString()
        }
      })

      return 'Success ✅'
    }
  })

export default blogRouter
