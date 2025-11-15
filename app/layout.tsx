import "./globals.css";
import { Header } from "@/app/component/Header";
import React from "react";
import SupportButton from "./component/SupportButton";
import Footer from "./component/Footer";
import { GoogleAnalytics } from '@next/third-parties/google'


  export const Catagories = [
   "Ethiopian Fiction",
    "History",
    "Science",
    "Religion",
    "Philosophy",
    "Psychology",
    "Biography",
    "Others"

  ]
  export interface Book {
    id: number;
    name: string;
    author: string;
    description: string;
    rating: number;
    category: string;
    image_path: string | null;
    file_size: number | null;
    channel_message_id: number | null;
    file_name: string | null;
    download_link: string | null;
    downloads: number | null;
    slug: string | null;
  }
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <GoogleAnalytics gaId="G-KN05KYY1CK" />
      <body>
        <div className="min-h-screen bg-gray-50">
      <Header/>
      
        {children}
      <Footer/>
        </div>
      <SupportButton />
      </body>
    </html>
  );
}
