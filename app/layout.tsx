import "./globals.css";
import { Header } from "@/app/component/Header";
import React from "react";
import { FilterBar } from "./component/FilterBar";
import Script from 'next/script'

import { GoogleAnalytics } from '@next/third-parties/google'
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
      <GoogleAnalytics gaId="G-KN05KYY1CK" />
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
