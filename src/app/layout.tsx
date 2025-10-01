import type { Metadata } from "next";
import { Barlow, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const barlow = Barlow({
  weight: '400', subsets: ['latin'], display: 'swap', 
})

export const metadata: Metadata = {
  title: "Portfolio | Abdullah",
  description: "Modernize your web applications with Abdullah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${barlow.className} antialiased`}
      >
        <main className="mx-auto px-4 sm:px-0 sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl duration-200">
          <Navbar />
          <div className="h-[calc(100vh-4rem)]">{children}</div>
        </main>
      </body>
    </html>
  );
}
