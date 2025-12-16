"use client";

import { Search, User, LogIn, LogOut, ChevronDown ,BookOpen} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import SearchAway from "./clients/search";

export function Header() {
  const [open, setOpen] = useState(false);
  const style: any = {
    topheader: { flexWrap: "wrap", padding: ".5rem .5rem", gap: "1rem" },
    searchbar: { minWidth: "10rem" },
  };

  const {
    data: session,
    isPending,
  }: { data: any; isPending: boolean } = authClient.useSession();

  const userName =
    session?.user?.name || session?.user?.email || session?.user?.role || "User";
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={style.topheader} className="flex items-center justify-between ">
          <div className="flex items-center gap-3">
            <img
              src="/image.png"
              style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              alt=""
            />
            <a href="/">
              <h1 className="text-2xl font-bold text-gray-900">Yemesahft Alem</h1>
            </a>
          </div>

          <div style={style.searchbar} className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <SearchAway />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isPending ? (
              <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-800"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">{userName}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {open && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg z-50">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-800"
                      onClick={() => setOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    {
                      session?.isAdmin &&(<Link
                          href="/admin/add-book"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-800"
                          onClick={() => setOpen(false)}
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Add Book</span>
                        </Link>
                        )
                    }
                    <button
                      onClick={async () => {
                        setOpen(false);
                        await authClient.signOut();
                        window.location.href = "/";
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 text-gray-800"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                   
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
                >
                  <User className="w-5 h-5" />
                  <span>Login</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
