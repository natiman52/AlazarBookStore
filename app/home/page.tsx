import { PrismaClient } from "@/prisma/generated/prisma/client";
import BookCard from "../component/bookcard";
import Link from "next/link";
import { BookOpen, TrendingUp, Star, ArrowRight, Library } from 'lucide-react';
import AnimatedBackground from "../component/AnimatedBackground";

export const metadata = {
  title:"Yemesahft Alem"
}
export default async function HomePage() {
  const prisma = new PrismaClient()
  
  // Get featured books (top rated or most downloaded)
  const featuredBooks = await prisma.books.findMany({
    take: 6,
    orderBy: [
      { rating: 'desc' },
      { downloads: 'desc' }
    ],
    where: {
      rating: { 
        gte: 5
      },
      category: { not: "school" }
    }
  });
  
  prisma.$disconnect()

  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-gray-50 py-16 md:py-24 overflow-hidden">
        <AnimatedBackground />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 p-4 rounded-full">
                <BookOpen className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-blue-600">Yemesahft Alem</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover thousands of books across all genres. Your next great read is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Browse Library
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="/home#featured"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
              >
                Featured Books
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-3">
                <Library className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">1000+</h3>
              <p className="text-gray-600">Books Available</p>
            </div>
            <div>
              <div className="flex justify-center mb-3">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">6+</h3>
              <p className="text-gray-600">Categories</p>
            </div>
            <div>
              <div className="flex justify-center mb-3">
                <Star fill="blue" strokeWidth={0} className="w-8 h-8 text-blue-600 " />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-gray-600">All Downloads</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section id="featured" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Featured Books
              </h2>
              <p className="text-gray-600">Handpicked selections for you</p>
            </div>
            <Link 
              href="/"
              className="hidden sm:flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              View All
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
          
          {featuredBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {featuredBooks.map((book) => (
                <BookCard key={book.id} book={book}/>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No featured books available yet.</p>
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link 
              href="/"
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              View All Books
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Explore by Category
            </h2>
            <p className="text-gray-600">Find your next favorite book by genre</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Ethiopian Fiction", image: "/category_images/ethiopian_fiction.png" },
              { name: "History", image: "/category_images/history.png" },
              { name: "Science", image: "/category_images/science.png" },
              { name: "Religion", image: "/category_images/religion.png" },
              { name: "Philosophy", image: "/category_images/philosophy.png" },
              { name: "Psychology", image: "/category_images/psychology.png" }
            ].map((category) => (
              <Link
                key={category.name}
                href={`/category/${category.name}`}
                className="group relative overflow-hidden rounded-lg aspect-square shadow-md hover:shadow-xl transition-all duration-300"
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center p-4">
                  <h3 className="font-bold text-white text-lg text-center group-hover:text-blue-200 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Reading?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of readers and discover your next favorite book today.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
          >
            Browse All Books
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}

