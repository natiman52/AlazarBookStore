'use server'

import { PrismaClient } from '@/prisma/generated/prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export async function createBlog(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const author = formData.get('author') as string
  const image_path = formData.get('image_path') as string

  if (!title || !content) {
    throw new Error('Title and content are required')
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

  await prisma.blog.create({
    data: {
      title,
      content,
      author,
      slug,
      image_path,
    },
  })

  revalidatePath('/blog')
  redirect('/blog')
}

export async function getBlogs() {
  return await prisma.blog.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getBlogBySlug(slug: string) {
  return await prisma.blog.findUnique({
    where: {
      slug,
    },
  })
}

export async function getOtherBlogs(currentSlug: string) {
  return await prisma.blog.findMany({
    where: {
      slug: {
        not: currentSlug,
      },
    },
    take: 3,
    orderBy: {
      createdAt: 'desc',
    },
  })
}
