

import React from "react";
import Script from 'next/script'
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8533445848126839"  crossOrigin="anonymous"/>
      <body>
        <div className="min-h-screen bg-gray-50">
        {children}
        </div>
      </body>
    </html>
  );
}
