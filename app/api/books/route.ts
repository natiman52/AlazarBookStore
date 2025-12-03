import { PrismaClient } from "@/prisma/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

const ITEMS_PER_PAGE = 15;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const search = searchParams.get("search") || "";
    
    const prisma = new PrismaClient();
    const skip = (page - 1) * ITEMS_PER_PAGE;

    // Build where clause for search
    const category = searchParams.get("category");

    // Build where clause
    let whereClause: any = {};
    
    if (category) {
      whereClause.category = category;
    } else if (!search) {
      // When not searching and no category specified, exclude books with "exclude" category
      whereClause.category = { not: "school" };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { author: { contains: search } }
      ];
    }

    // Get total count
    const totalCount = await prisma.books.count({
      where: whereClause
    });

    // Get books
    const books = await prisma.books.findMany({
      skip: skip,
      take: ITEMS_PER_PAGE,
      where: whereClause,
      orderBy: {
        id: 'desc'
      }
    });

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const hasMore = page < totalPages;

    await prisma.$disconnect();

    return NextResponse.json({
      books,
      hasMore,
      currentPage: page,
      totalPages,
      totalCount
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

