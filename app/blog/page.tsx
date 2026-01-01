
import {prisma} from '@/lib/prisma';

import Link from 'next/link'

export const metadata ={
  title:"Blogs"
}
export default async function BlogPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {blog.image_path && (
              <img src={blog.image_path} alt={blog.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-600 text-sm mb-4">
                By {blog.author || 'Unknown'} on {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-700 line-clamp-3 mb-4">{blog.content}</p>
              <Link href={`/blog/${blog.slug}`} className="text-blue-600 hover:underline font-medium">
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
      {blogs.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No blog posts found.</p>
      )}
    </div>
  )
}
