import { MetadataRoute } from "next";
import { PrismaClient } from "@/prisma/generated/prisma/client";
import { Catagories } from "./layout";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const client =new PrismaClient()
    const books = await client.books.findMany()
    const book_urls:any = books.map(e => {
                return {url: `https://yemesahftalem.com/${e.id}`,lastModified: new Date(),changeFrequency: 'yearly',priority:1,}
    })
    const catagories_url = Catagories.map(e => {
        return  {url: `https://yemesahftalem.com/category/${e}`,lastModified: new Date(),changeFrequency: 'yearly',priority: 0.8,}
    }) 
    return [
        ...book_urls,
        {
            url:'https://yemesahftalem.com',
            priority:1
        },
        ...catagories_url
    ]
}