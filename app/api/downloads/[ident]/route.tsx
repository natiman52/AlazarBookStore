import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@/prisma/generated/prisma/client";

type ResponseData = {
  message: string
}
 
export async function GET(
  req: NextRequest,
  {params}:{params:Promise<{ident:string}>} 
) {

  const ident  =(await params).ident
  const url = `https://t.me/${process.env.BOT_ID}?start=${ident}`
  const prisma = new PrismaClient()
  const existingPost = await prisma.books.findUnique({
  where: { 
        id:Number(ident)
        }});
  const obj = await prisma.books.update({
  where:{
    id:Number(ident)
  },
  data:{
    downloads:existingPost?.downloads != undefined ? (existingPost?.downloads + 1) : 0
  }
  })

  return Response.redirect(url)
}

