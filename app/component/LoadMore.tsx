"use client";

import { useState } from "react";
import BookCard from "./bookcard";
import { Loader2 } from "lucide-react";
import { Book } from "../layout";


interface LoadMoreProps {
  initialBooks: Book[];
  initialHasMore: boolean;
  searchQuery?: string;
}

export default function LoadMore({ initialBooks, initialHasMore, searchQuery }: LoadMoreProps) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;
      const params = new URLSearchParams();
      params.set("page", nextPage.toString());
      if (searchQuery) {
        params.set("search", searchQuery);
      }

      const response = await fetch(`/api/books?${params.toString()}`);
      const data = await response.json();

      if (data.books && data.books.length > 0) {
        setBooks((prev) => [...prev, ...data.books]);
        setHasMore(data.hasMore);
        setCurrentPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">
          No books found matching your criteria
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8 mb-4">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-full transition-colors shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Load More</span>
            )}
          </button>
        </div>
      )}

      {!hasMore && books.length > 0 && (
        <div className="text-center mt-8 mb-4">
          <p className="text-gray-500 text-sm">
            You've reached the end of the list
          </p>
        </div>
      )}
    </>
  );
}

