import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: '400', subsets: ['latin'], display: 'swap',
})

export const metadata: Metadata = {
  title: "New | GSAP",
  description: "Modernize your web applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scrollbar-none scrollbar-thumb-black dark:scrollbar-thumb-white scrollbar-track-transparent">
      <head>
      </head>
      <body className={` ${poppins.className} antialiased `}>
        <main className="mx-auto px-4 sm:px-0 sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl duration-400">
          {children}
        </main>
      </body>
    </html>
  );
}
