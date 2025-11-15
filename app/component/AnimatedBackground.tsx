"use client";

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      {/* Floating book icons */}
      <div className="absolute top-20 left-10 text-4xl opacity-10 animate-float animation-delay-1000">📚</div>
      <div className="absolute top-40 right-20 text-5xl opacity-10 animate-float animation-delay-3000">📖</div>
      <div className="absolute bottom-20 left-1/4 text-4xl opacity-10 animate-float animation-delay-2000">📕</div>
      <div className="absolute bottom-40 right-1/3 text-5xl opacity-10 animate-float animation-delay-4000">📗</div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
    </div>
  );
}



