// app/api/book-image/[bookId]/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';
import { Readable } from 'stream'; // Node.js stream for converting
import { PrismaClient } from '@/prisma/generated/prisma/client';
const BOT_TOKEN = "7764064030:AAHdRElO-aSdwb-202RpOnSoHlvXAe-ZGoM"
;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const TELEGRAM_FILE_URL = `https://api.telegram.org/file/bot${BOT_TOKEN}`;

const prisma = new PrismaClient()
function streamToWebStream(nodeStream: Readable): ReadableStream {
    return new ReadableStream({
        start(controller) {
            nodeStream.on('data', (chunk) => {
                controller.enqueue(chunk);
            });
            nodeStream.on('end', () => {
                controller.close();
            });
            nodeStream.on('error', (err) => {
                controller.error(err);
            });
        },
    });
}

export async function GET(
    request: Request,
    { params }: { params: { FileID: String } }
) {
    let filePath: string | null = null;
    try {
        const tgResponse = await axios.get(`${TELEGRAM_API_URL}/getFile?file_id=${params.FileID}`);
        filePath = tgResponse.data.result.file_path;
    } catch (tgErr) {
        console.error('Telegram API Error:', (tgErr as any).response?.data || tgErr);
        return new NextResponse('Could not retrieve Telegram file path.', { status: 500 });
    }

    // 3. Construct the full download URL
    const fileUrl = `${TELEGRAM_FILE_URL}/${filePath}`;

    // 4. Stream the file back to the browser
    try {
        // Fetch the file as a stream
        const imageResponse = await axios.get(fileUrl, { 
            responseType: 'stream',
        });
        
        const contentType = imageResponse.headers['content-type'] || 'image/jpeg';
        
        // Convert the Node.js Stream to a Web Stream
        const webStream = streamToWebStream(imageResponse.data);

        // Return the image as a streamed response
        return new Response(webStream, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });

    } catch (streamErr) {
        console.error('File streaming error:', streamErr);
        return new NextResponse('Failed to stream image.', { status: 500 });
    }
}