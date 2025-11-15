import { PrismaClient } from "@/prisma/generated/prisma/client";
import { Catagories } from "./layout";
import { FilterBar } from "./component/FilterBar";
import LoadMore from "./component/LoadMore";
import Sidebar from "./component/Sidebar";

const ITEMS_PER_PAGE = 15;

export default async function Home({ searchParams }: {searchParams:any}) {
  const params = await searchParams
  const prisma = new PrismaClient()
  
  // Build where clause for search
  let whereClause: any = {}
  if (params.search) {
    // When searching, include all books (including "exclude" category)
    whereClause = {
      OR: [
        { name: { contains: params.search as string } },
        { description: { contains: params.search as string } },
        { author: { contains: params.search as string } }
      ]
    }
  } else {
    // When not searching, exclude books with "exclude" category
    whereClause = {
      category: { not: "school" }
    }
  }

  // Get total count
  const totalCount = await prisma.books.count({
    where: whereClause
  })

  // Get initial books (first page)
  const data = await prisma.books.findMany({
    take: ITEMS_PER_PAGE,
    where: whereClause,
    orderBy: {
      id: 'desc'
    }
  })

  // Get best books for sidebar (top 5 by rating and downloads)
  const bestBooks = await prisma.books.findMany({
    take: 5,
    orderBy: [
      { rating: 'desc' },
      { downloads: 'desc' }
    ],
    where: {
      rating: { gte: 7 },
      category: { not: "school" }
    }
  })

  // Get all books for random picker (limited to 100 for performance)
  const allBooksForRandom = await prisma.books.findMany({
    take: 100,
    where: {
      category: { not: "school" }
    },
    select: {
      id: true,
      name: true,
      author: true,
      description: true,
      rating: true,
      category: true,
      image_path: true,
      file_size: true,
      channel_message_id: true,
      file_name: true,
      download_link: true,
      downloads: true,
      slug: true,
    }
  })

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
  const hasMore = totalPages > 1

  prisma.$disconnect()
  
  return (
    <>
   
    {Catagories.length > 0 && (
      <FilterBar
        categories={Catagories}
      />
    )}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <main className="flex-1">
          {data.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No books found matching your criteria
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  {totalCount} {totalCount === 1 ? 'book' : 'books'}
                  {params.search && ` found for "${params.search}"`}
                </p>
              </div>
              <LoadMore 
                initialBooks={data}
                initialHasMore={hasMore}
                searchQuery={params.search as string | undefined}
              />
            </>
          )}
        </main>

        {/* Sidebar - Only show when not searching */}
        {!params.search && (
          <Sidebar 
            bestBooks={bestBooks}
            allBooks={allBooksForRandom}
          />
        )}
      </div>
    </div>
      </>
  );
}
