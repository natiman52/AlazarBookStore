 import { Catagories } from "@/app/layout";
import { FilterBar } from "@/app/component/FilterBar";
import LoadMore from "@/app/component/LoadMore";
import {prisma} from '@/lib/prisma';

import { Metadata } from "next";

export async function generateMetadata({ searchParams,params }: { searchParams:{search:string},params: { name: string } }): Promise<Metadata>{
  const para = await params
  return {
    title:`Category: ${para.name.replaceAll("%20"," ")}`,
  }
}
export default async function Home({ searchParams,params }: { searchParams:{search:string},params: { name: string } }) {
  const par =await params
  const searc =await searchParams
  
  const ITEMS_PER_PAGE = 15;

const searchTerm = searc.search ? decodeURIComponent(searc.search) : undefined;
const categoryName = par.name ? decodeURIComponent(par.name) : undefined;

let whereClause: any = {};

if (searchTerm) {
  whereClause = {
    category: categoryName,
    AND: [
      {
        OR: [
          { name: { search: searchTerm } },
          { author: { search: searchTerm } }
        ]
      }
    ]
  };
} else {
  whereClause = {
    category: {
      equals: categoryName,
      not: "school"
    }
  };
}

  const [data, totalCount] = await Promise.all([
    prisma.books.findMany({
      where: whereClause,
      take: ITEMS_PER_PAGE,
      orderBy: {
        id: 'desc'
      }
    }),
    prisma.books.count({
      where: whereClause,
    })
  ]);

  const hasMore = totalCount > ITEMS_PER_PAGE;

  return (
    <>
    {Catagories.length > 0 && (
      <FilterBar
        categories={Catagories}
      />
    )}
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                Showing {data.length} {data.length === 1 ? 'book' : 'books'} of {totalCount}
              </p>
            </div>
            
            <LoadMore 
              initialBooks={data} 
              initialHasMore={hasMore} 
              category={par.name.replace("%20", " ")}
              searchQuery={searc.search}
            />
          </>
        )}
      </main>
    </>
  );
}
