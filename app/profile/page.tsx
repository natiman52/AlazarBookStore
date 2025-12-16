"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LogOut, Mail, Shield, User,Network } from "lucide-react";
import { useMemo } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const {
    data: session,
    isPending,
    error,
    refetch,
  }: { data: any; isPending: boolean; error: Error | null; refetch: () => void } =
    authClient.useSession();

  const user = session?.user;
  const role = useMemo(() => session?.isAdmin ? "admin" : "user", [session?.isAdmin]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-700">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded shadow max-w-sm text-center space-y-4">
          <p className="text-red-600 font-semibold">
            Failed to load session. Please try again.
          </p>
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded shadow max-w-sm text-center space-y-4">
          <p className="text-gray-800 font-semibold">
            You need to be signed in to view your profile.
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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.name || user?.email || "Your profile"}
              </h1>
              <p className="text-gray-500 text-sm">
                {role === "admin" ? "Admin account" : "Standard account"}
              </p>
            </div>
          </div>

          <button
            onClick={async () => {
              await authClient.signOut();
              router.push("/");
            }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-800"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        <div className="border-t pt-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Account details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
              <Network className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-gray-500">name</p>
                <p className="text-gray-900 break-all">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-gray-500">Email</p>
                <p className="text-gray-900 break-all">{user?.email}</p>
              </div>
            </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-gray-500">Username</p>
                <p className="text-gray-900 break-all">{user?.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-gray-500">Role</p>
                <p className="text-gray-900 capitalize">{role}</p>
              </div>
            </div>
          </div>
        </div>

        {role === "admin" && (
          <div className="border-t pt-6 space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Admin actions</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/admin/add-book")}
                className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
              >
                Add new book
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


