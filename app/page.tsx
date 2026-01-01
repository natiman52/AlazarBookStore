 import { Catagories } from "./layout";
import { FilterBar } from "./component/FilterBar";
import LoadMore from "./component/LoadMore";
import Sidebar from "./component/Sidebar";
import {prisma} from '@/lib/prisma';


const ITEMS_PER_PAGE = 15;

export const metadata = {
  title:"Yemesahft Alem",
  metadataBase: new URL(process.env.BASE_URL || "https://yemesahftalem.com/"),
  alternates: {
    canonical: "/", // or the specific path for the page
  },
};
export default async function Home({ searchParams }: {searchParams:any}) {
  const params = await searchParams;

  let whereClause: any = params.search 
  ? {
      name: { search: params.search as string },
      author: { search: params.search as string },
    }
  : {
      category: { not: "school" }
    };

  const [totalCount, data,bestBooks,allBooksForRandom] = await Promise.all([
    prisma.books.count({
        where: whereClause
      }),
    prisma.books.findMany({
    take: ITEMS_PER_PAGE,
    where: whereClause,
    orderBy: {
      id: 'desc'
    }
  }),
  prisma.books.findMany({
    take: 5,
    orderBy: [
      { rating: 'desc' },
      { downloads: 'desc' }
    ],
    where: {
      rating: { gte: 7 },
      category: { not: "school" }
    }
  }),
  prisma.books.findMany({
    take: 10,
    where: {
      category: { not: "school" }
    },
    select: {
      id: true,
      name: true,
      author: true,
      rating: true,
      downloads: true,
      slug: true,
      category: true
    }
  })
  ])


 
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const hasMore = totalPages > 1;


  return (
    <>
      {Catagories.length > 0 && (
        <FilterBar
          categories={Catagories}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <main className="flex-1">
            {data.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">
                  No books found matching your criteria
                </p>
              </div>
            ) : (
              <>
                <LoadMore 
                  initialBooks={data}
                  initialHasMore={hasMore}
                  searchQuery={params.search as string | undefined}
                />
              </>
            )}
          </main>

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