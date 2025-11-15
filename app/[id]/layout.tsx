

import React from "react";
import Script from 'next/script'
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
        <>
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8533445848126839"  crossOrigin="anonymous"/>
        {children}
        </>
  );
}
