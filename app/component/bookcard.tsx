import Link from "next/link";
import { FileText,Download } from 'lucide-react';
interface Props {
    book: {
    category: string,
    name: string,
    id: number,
    author: string,
    description: string,
    rating: number,
    image_path: string | null,
    file_size: number | null,
    channel_message_id: number | null,
    file_name: string | null,
    download_link: string | null,
    downloads: number | null,
    }
}

export function formatBytes(bytes:number | null, decimals = 2) {

  if (bytes === 0 || bytes == null) return '0 Bytes';

  const k = 1024; // Or 1000 for SI units
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
export default function BookCard({book}:Props){
    return (
   <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div 
        style={{aspectRatio:"3/4"}} className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden cursor-pointer"
       
      >
        {book.image_path ? (
          <img
            src={`/book_images/${book.image_path.split("/").at(-1)}`}
            alt={book.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-20 h-20 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
      </div>

      <div className="p-4">
        <Link href={`/${book.id}`}
          className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors cursor-pointer"
        >
          {book.name}
        </Link>
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>

        {book.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
            {book.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="bg-gray-100 px-2 py-1 rounded">{book.category}</span>
          <span>{formatBytes(Number(book.file_size))}</span>
        </div>


        <div className="mt-2 text-center text-xs text-gray-400">
          {book.downloads} downloads
        </div>
      </div>
    </div>
    )
}
