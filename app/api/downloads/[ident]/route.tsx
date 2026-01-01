import { NextRequest } from 'next/server';
import {prisma} from '@/lib/prisma';
export async function GET(
  req: NextRequest,
  {params}:{params:Promise<{ident:string}>} 
) {
  const ident  =(await params).ident
  const url = `https://t.me/${process.env.BOT_ID}?start=${ident}`
  const obj = await prisma.books.update({
  where:{
    id:Number(ident)
  },
  data:{
    downloads:{
      increment: 1
    }
  }
  })
  return Response.redirect(url)
}

