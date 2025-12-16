import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/prisma/generated/prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

// Ensure upload directory exists
const UPLOAD_DIR = path.join(process.cwd(), "public", "book_images");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const password = formData.get("password") as string;

    // 1. Validate Password
    if (password !== process.env.ADMIN_PASSWORD || password !== "admin123") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const name = formData.get("name") as string;
    const author = formData.get("author") as string;
    const description = formData.get("description") as string;
    const rating = parseFloat((formData.get("rating") as string) || "0");
    const category = formData.get("category") as string;
    const imageFile = formData.get("image") as File;
    const bookFile = formData.get("book") as File;

    if (!imageFile || !bookFile) {
      return NextResponse.json({ error: "Missing files" }, { status: 400 });
    }

    // 2. Save Image Locally
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const imageExt = path.extname(imageFile.name) || ".jpg";
    const imageFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}${imageExt}`;
    const imagePath = path.join(UPLOAD_DIR, imageFileName);
    await writeFile(imagePath, imageBuffer);
    
    // Relative path for DB
    const dbImagePath = path.join(process.cwd(), "public", "book_images", imageFileName);


    // 3. Upload Book to Telegram
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const channelId = process.env.TELEGRAM_CHANNEL_ID;

    if (!telegramToken || !channelId) {
      return NextResponse.json({ error: "Telegram configuration missing" }, { status: 500 });
    }

    const telegramFormData = new FormData();
    telegramFormData.append("chat_id", channelId);
    telegramFormData.append("document", bookFile, bookFile.name);
    telegramFormData.append("caption", `Book: ${name} by ${author}`);

    const telegramRes = await fetch(`https://api.telegram.org/bot${telegramToken}/sendDocument`, {
      method: "POST",
      body: telegramFormData,
    });

    const telegramData = await telegramRes.json();

    if (!telegramData.ok) {
      console.error("Telegram Upload Error:", telegramData);
      return NextResponse.json({ error: "Failed to upload to Telegram" }, { status: 502 });
    }

    const messageId = telegramData.result.message_id;
    const fileSize = bookFile.size;
    const fileName = bookFile.name;

    // 4. Create Slug
    const slug = `${name.toLowerCase().replace(/ /g, "-")}-${author.toLowerCase().replace(/ /g, "-")}`.replace(/[^a-z0-9-]/g, "");

    // 5. Save to Database
    const newBook = await prisma.books.create({
      data: {
        name,
        author,
        description,
        rating,
        category,
        image_path: dbImagePath, 
        channel_message_id: messageId,
        file_name: fileName,
        file_size: fileSize,
        slug,
        downloads: 0,
      },
    });

    return NextResponse.json({ success: true, book: newBook });

  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
