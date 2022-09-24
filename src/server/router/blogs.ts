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

export default blogRouter
