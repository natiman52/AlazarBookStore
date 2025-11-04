import "./globals.css";
import { Header } from "@/app/component/Header";
import React from "react";
import { FilterBar } from "./component/FilterBar";
import Script from 'next/script'
import Footer from "./component/Footer";
import { GoogleAnalytics } from '@next/third-parties/google'
export const metadata = {
      title:"Yemesahft Alem"
    };

  export const Catagories = [
   "Science Fiction",
    "Fantasy",
    "Thriller",
    "Self-Help",
    "Biography",
    "Horror",
  ]
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8533445848126839"  crossOrigin="anonymous"/>
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
      <Footer/>
        </div>
      </body>
    </html>
  );
}
