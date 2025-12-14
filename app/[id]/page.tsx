import { PrismaClient } from "@/prisma/generated/prisma/client";
import { ArrowLeft, Download, Calendar, FileText, User, Tag, TrendingUp } from 'lucide-react';
import { notFound } from 'next/navigation';
import GetByte from "../component/clients/getBytes";
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const param = await params
  const prisma = new PrismaClient()
  const book = await prisma.books.findFirst({
    where: { slug: param.id }
  })
  
  return {
    title: book?.name || 'Book Details',
  }
}

export default async function Home({ params }: { params: { id: string } }) {
  const param =await params
    const prisma = new PrismaClient()
    const book = await prisma.books.findFirst({
      where:{slug:param.id}
    })
    const relatedBooks = await prisma.books.findMany({
      where:{
        slug:{
          not:book?.slug
        },
        category:book?.category,
        NOT: {
          category: "school"
        }
      },
      take:3,
      
    })
  if (!book) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <a
            href={"/"}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to library
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-3 gap-8 p-8">
            <div className="md:col-span-1">
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-lg">
                {book.image_path ? (
                  <img
                    src={`/book_images/${book.image_path.split("/").at(-1)}`}
                    alt={book.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="w-24 h-24 text-gray-400" />
                  </div>
                )}
              </div>
                <a href={`/api/downloads/${book.id}`}>
                  <button
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 font-medium"
              >
                <Download className="w-5 h-5" />
                Download 
                  </button>
                </a>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Category:</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                    {book.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Size:</span>
                  <span><GetByte size={book?.file_size}/></span>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Downloads:</span>
                  <span>{book.downloads}</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Added:</span>
                  <span>{book.created_at.toDateString()}</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{book.name}</h1>

              <div className="flex items-center gap-2 text-lg text-gray-600 mb-6">
                <User className="w-5 h-5" />
                <span>by {book.author}</span>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">About this book</h2>
                <p className="text-gray-700 leading-relaxed">
                  {book.description || 'No description available for this book.'}
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Book Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Author</p>
                    <p className="font-medium text-gray-900">{book.author}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Category</p>
                    <p className="font-medium text-gray-900">{book.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">File Size</p>
                    <p className="font-medium text-gray-900"><GetByte size={book.file_size}/></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {relatedBooks.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">More books in {book.category}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {relatedBooks.map((relatedBook) => (
                <div
                  key={relatedBook.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200">
                    {relatedBook.image_path ? (
                      <img
                        src={`/book_images/${relatedBook.image_path.split("/").at(-1)}`}
                        alt={relatedBook.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <a href={`/${relatedBook.slug}`} className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                      {relatedBook.name}
                    </a>
                    <p className="text-xs text-gray-600">{relatedBook.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
 
      </div>
    </div>
  );
}

    /**   
        **/ 