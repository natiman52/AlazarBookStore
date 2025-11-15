import { PrismaClient } from "@/prisma/generated/prisma/client";
import BookCard from "@/app/component/bookcard";
import { Catagories } from "@/app/layout";
import { FilterBar } from "@/app/component/FilterBar";
function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export default async function Home({ searchParams,params }: { searchParams:{search:string},params: { name: string } }) {
  const par =await params
  const searc =await searchParams
  
  const prisma = new PrismaClient()
  if(searc.search){
    var data = await prisma.books.findMany({
      take:15,
      where:{
        category:par.name.replace("%20"," "),
        OR:[{
          name:{
            contains:searc.search.replace("%20"," ")
          }},
        {description:{contains:searc.search}},{author:searc.search}]
      }
    })
  }
  else{
    console.log(par.name.replace("%20"," "))
    var data = await prisma.books.findMany({
        where:{
            category:par.name.replace("%20"," ")
        },
        take:15})
  }
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
                Showing {data.length} {data.length === 1 ? 'book' : 'books'}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {data.map((book) => (
                <BookCard key={book.id} book={book}/>
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}
