import { getBlogBySlug, getOtherBlogs } from '../../actions/blog'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  return {
    title: blog?.title || 'Blog Post',
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    notFound()
  }

  const otherBlogs = await getOtherBlogs(slug)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/blog" className="mb-5 text-blue-600 hover:underline mb-8 inline-block">
        &larr; Back to Blog
      </Link>
      <article className="rounded-lg overflow-hidden mb-12">
        {blog.image_path && (
          <img src={blog.image_path} alt={blog.title} className="w-full h-56 object-cover" />
        )}
        <div className="p-8 px-0">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <div className="flex items-center text-gray-600 mb-8">
            <span className="mr-4">By {blog.author || 'Unknown'}</span>
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="prose max-w-none">
            {blog.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-800 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>

      {otherBlogs.length > 0 && (
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Other Blogs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherBlogs.map((otherBlog) => (
              <div key={otherBlog.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {otherBlog.image_path && (
                  <img src={otherBlog.image_path} alt={otherBlog.title} className="w-full h-32 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-1">{otherBlog.title}</h3>
                  <p className="text-gray-600 text-xs mb-2">
                    {new Date(otherBlog.createdAt).toLocaleDateString()}
                  </p>
                  <Link href={`/blog/${otherBlog.slug}`} className="text-blue-600 hover:underline text-sm font-medium">
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
