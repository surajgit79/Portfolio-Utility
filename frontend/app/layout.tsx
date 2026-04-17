import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { Navbar } from "../components/defaults/Navbar";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeIC | Teacher Utility",
  description: "Teacher Utility App for NeIC",
  icons: {
    icon: '/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${openSans.variable} h-full antialiased`}
    >

      <body className="min-h-full flex flex-col bg-[#EBF4FB]">
        <Navbar />
        <div className="px-15">
          {children}
        </div>
      </body>
    </html>
  );
}
