import "./globals.css";
import { Header } from "@/app/component/Header";
import React from "react";
import { FilterBar } from "./component/FilterBar";


 export const metadata = {
      title:"Get freebooks"
    };
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const Catagories = [
    "Science Fiction","Horror"
  ]
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50">
      <Header/>
      {Catagories.length > 0 && (
        <FilterBar
          categories={Catagories}
        />
      )}
        {children}
        </div>
      </body>
    </html>
  );
}
