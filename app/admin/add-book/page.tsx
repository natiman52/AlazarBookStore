"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side check for now, but the API will also verify.
    // Ideally, this should be a secure session check.
    if (password === process.env.ADMIN_PASSWORD ) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

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
      data.append("password", password); // Send password for server-side validation
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md">
          <h1 className="text-2xl font-bold mb-4">Admin Access</h1>
          <input
            type="password"
            placeholder="Enter Password"
            className="border p-2 w-full mb-4 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
          >
            Enter
          </button>
        </form>
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
