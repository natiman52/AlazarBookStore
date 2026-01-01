"use client";
import { Star, Shuffle, TrendingUp } from "lucide-react";
import { Book } from "../layout";
import { useState } from "react";

interface SidebarProps {
  bestBooks: Book[];
  allBooks: any[];
}

export default function Sidebar({ bestBooks, allBooks }: SidebarProps) {
  const [randomBook, setRandomBook] = useState<Book | null>(null);

  const pickRandomBook = () => {
    if (allBooks.length === 0) return;
    const randomIndex = Math.floor(Math.random() * allBooks.length);
    setRandomBook(allBooks[randomIndex]);
  };
  return (
    <aside className="w-full lg:w-80 space-y-6">
      {/* Random Book Picker */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Shuffle className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Random Book</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Can't decide what to read? Let us pick a book for you!
        </p>
        <button
          onClick={pickRandomBook}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Shuffle className="w-4 h-4" />
          Pick a Random Book
        </button>
        
        {randomBook && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <a 
              href={`/${randomBook.slug || randomBook.id}`}
              className="block group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                {randomBook.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{randomBook.author}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{randomBook.rating}/10</span>
                <span className="mx-1">•</span>
                <span className="bg-gray-200 px-2 py-0.5 rounded">{randomBook.category}</span>
              </div>
              <p className="text-xs text-blue-600 mt-2 font-medium">
                View Book →
              </p>
            </a>
          </div>
        )}
      </div>

      {/* Best Books */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-green-100 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Best Books</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Top rated books you might enjoy
        </p>
        
        {bestBooks.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No books available yet
          </p>
        ) : (
          <div className="space-y-4">
            {bestBooks.map((book, index) => (
              <a
                key={book.id}
                href={`/${book.slug || book.id}`}
                className="block group hover:bg-gray-50 p-3 rounded-lg transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                      {book.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">{book.author}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-gray-600">{book.rating}/10</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">{book.downloads || 0} downloads</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
      {/* place holder for ad*/}
        <div className="ezoic-pub-ad-placeholder-106">

        </div>
    </aside>
  );
}

