"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const CATEGORIES = [
  "Ethiopian Fiction",
  "History",
  "Science",
  "Religion",
  "Philosophy",
  "Psychology",
  "Biography",
  "Others",
  "school",
];

export default function AddBookPage() {
  const { data: session, isPending, error, refetch } : { data: any, isPending: boolean, error: Error | null, refetch: () => void } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    author: "",
    description: "",
    rating: "",
    category: CATEGORIES[0],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [bookFile, setBookFile] = useState<File | null>(null);

  const role = useMemo(() => session?.user?.role ?? "user", [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !bookFile) {
      alert("Please upload both an image and a book file.");
      return;
    }

    setLoading(true);
    setMessage("Uploading...");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("author", formData.author);
      data.append("description", formData.description);
      data.append("rating", formData.rating);
      data.append("category", formData.category);
      data.append("image", imageFile);
      data.append("book", bookFile);

      const res = await fetch("/api/books/create", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("Book added successfully!");
        // Reset form
        setFormData({
          name: "",
          author: "",
          description: "",
          rating: "",
          category: CATEGORIES[0],
        });
        setImageFile(null);
        setBookFile(null);
        await refetch();
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700">Checking authentication...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow max-w-sm text-center space-y-3">
          <p className="text-red-600 font-semibold">Failed to load session.</p>
          <button
            onClick={() => refetch()}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow max-w-sm text-center space-y-4">
          <p className="text-gray-800 font-semibold">
            Please sign in to add books.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow max-w-sm text-center space-y-4">
          <p className="text-red-600 font-semibold">
            You need an admin account to add books.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/")}
              className="flex-1 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
            >
              Back home
            </button>
            <button
              onClick={async () => {
                await authClient.signOut();
                router.push("/login");
              }}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Switch account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Book</h1>
        
        {message && (
          <div className={`p-4 mb-4 rounded ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Book Name</label>
            <input
              type="text"
              required
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Author</label>
            <input
              type="text"
              required
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              required
              rows={4}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Rating (0-10)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Category</label>
              <select
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              required
              className="w-full border p-2 rounded"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Book File (PDF/EPUB)</label>
            <input
              type="file"
              accept=".pdf,.epub"
              required
              className="w-full border p-2 rounded"
              onChange={(e) => setBookFile(e.target.files?.[0] || null)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded text-white font-bold transition-colors ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Processing..." : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
}
