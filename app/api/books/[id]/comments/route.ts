import { NextRequest, NextResponse } from "next/server";
 import { auth } from "@/lib/auth";
import {prisma} from '@/lib/prisma';


export async function GET(
  _req: NextRequest,
  { params }:any 
) {
  const param = await params
  console.log(param)
  const bookId = Number(param.id);
  if (!Number.isFinite(bookId)) {
    return NextResponse.json({ error: "Invalid book id" }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { bookId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return NextResponse.json({ comments });
}

export async function POST(
  req: NextRequest,
  { params }:any 
) {
  const param = await params
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookId = Number(param.id);
    if (!Number.isFinite(bookId)) {
      return NextResponse.json({ error: "Invalid book id" }, { status: 400 });
    }

    const body = await req.json();
    const content = (body?.content ?? "").trim();

    if (!content || content.length < 3) {
      return NextResponse.json(
        { error: "Comment is too short." },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        bookId,
        userId: (session.user as any).id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ comment });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}


