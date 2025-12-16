"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type Comment = {
  id: number;
  content: string;
  createdAt: string;
  user?: {
    name: string | null;
    email: string;
    role: string | null;
  } | null;
};

export default function Comments({ bookId }: { bookId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { data: session }: { data: any } = authClient.useSession();

  const loadComments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/books/${bookId}/comments`);
      if (!res.ok) return;
      const data = await res.json();
      setComments(data.comments ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (trimmed.length < 3) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/books/${bookId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: trimmed }),
      });
      if (!res.ok) {
        return;
      }
      const data = await res.json();
      setComments((prev) => [data.comment, ...prev]);
      setContent("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
        <span className="text-xs text-gray-500">({comments.length})</span>
      </div>

      {session ? (
        <form onSubmit={handleSubmit} className="mb-6 space-y-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="Share your thoughts about this book..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || content.trim().length < 3}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded text-sm font-medium text-white ${
                submitting || content.trim().length < 3
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <Send className="w-4 h-4" />
              {submitting ? "Posting..." : "Post comment"}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-gray-600 mb-4">
          Please log in to leave a comment.
        </p>
      )}

      {loading && comments.length === 0 && (
        <p className="text-sm text-gray-500">Loading comments...</p>
      )}

      {comments.length === 0 && !loading && (
        <p className="text-sm text-gray-500">No comments yet. Be the first!</p>
      )}

      <ul className="space-y-4">
        {comments.map((comment) => (
          <li key={comment.id} className="border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-900">
                {comment.user?.name || comment.user?.email || "Anonymous"}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="ms-4 text-sm text-gray-700 whitespace-pre-line">
              {comment.content}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}



