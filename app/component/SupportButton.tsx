"use client";

import Link from "next/link";

// Telegram icon SVG
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.17 1.816-.896 6.207-1.266 8.24-.156.896-.463 1.196-.76 1.226-.64.056-1.127-.422-1.748-.827-.969-.64-1.517-1.038-2.458-1.662-1.08-.72-.38-1.116.236-1.762.162-.165 2.967-2.72 3.023-2.95.006-.03.011-.15-.056-.212-.067-.062-.166-.041-.238-.024-.101.024-1.694 1.077-4.78 3.165-.453.31-.863.461-1.23.454-.406-.008-1.188-.23-1.77-.42-.714-.234-1.28-.357-1.23-.754.024-.19.36-.384.99-.583 3.89-1.68 6.48-2.79 7.77-3.33 3.75-1.6 4.53-1.88 5.04-1.89.112-.002.363.027.526.16.13.106.166.25.184.352.017.102.038.335.02.516z" />
  </svg>
);

export default function SupportButton() {
  const telegramUrl = "https://t.me/Yemesahft_Alem";

  return (
    <Link
      href={telegramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
      aria-label="Contact Support on Telegram"
    >
      <TelegramIcon className="w-6 h-6" />
    </Link>
  );
}

