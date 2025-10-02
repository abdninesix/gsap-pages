import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Stars from "@/components/Stars";

const poppins = Poppins({
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.classList.add(theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={` ${poppins.className} antialiased`}
      >
        <main className="mx-auto px-4 sm:px-0 sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl duration-200">
          <Stars count={25} />
          <Navbar />
          <div className="h-[calc(100vh-4rem)]">{children}</div>
        </main>
      </body>
    </html>
  );
}
