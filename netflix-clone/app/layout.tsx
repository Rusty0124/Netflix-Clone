import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import ContextProvider from "@/providers/ContextProvider";
import ModalProvider from "@/providers/ModalProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Netflix Clone",
  description: "A Netflix clone built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-brand-background text-white">
        <QueryProvider>
          <ContextProvider>
            <ModalProvider>{children}</ModalProvider>
          </ContextProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
