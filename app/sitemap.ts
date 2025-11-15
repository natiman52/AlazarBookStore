import { MetadataRoute } from "next";
import { PrismaClient } from "@/prisma/generated/prisma/client";
import { Catagories } from "./layout";

const baseUrl = 'https://yemesahftalem.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const client = new PrismaClient();
    
    // Get all books with their slugs and last modified dates
    const books = await client.books.findMany({
        select: {
            id: true,
            slug: true,
            created_at: true,
        }
    });

    // Generate book URLs (use slug if available, otherwise use id)
    const book_urls: MetadataRoute.Sitemap = books.map(book => ({
        url: `${baseUrl}/${book.slug || book.id}`,
        lastModified: book.created_at || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    // Generate category URLs
    const category_urls: MetadataRoute.Sitemap = Catagories.map(category => ({
        url: `${baseUrl}/category/${encodeURIComponent(category)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/home`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/terms-of-service`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
    ];

    await client.$disconnect();

    return [
        ...staticPages,
        ...book_urls,
        ...category_urls,
    ];
}