import { ArrowLeft } from "lucide-react";

export default function notFound(){
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Book not found</h2>
          <a href={"/"}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to library
          </a>
        </div>
      </div>
    );
}