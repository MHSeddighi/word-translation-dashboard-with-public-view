import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../presentation/styles/global.css";
import "react-loading-skeleton/dist/skeleton.css";
import { ToastContainer } from "react-toastify";
// import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dictionary",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        data-theme="light"
        dir="rtl"
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main>
          {/* <Header /> */}
          {children}
        </main>
        <ToastContainer rtl />
      </body>
    </html>
  );
}
