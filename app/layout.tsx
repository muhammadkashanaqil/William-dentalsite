import type { Metadata } from "next";
import { Playfair_Display, Sora } from "next/font/google";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "William Dentist | AI-Enabled Dental Clinic",
  description: "Experience premium dental care with William Dentist. Book appointments and chat with our AI concierge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-slate-900" suppressHydrationWarning>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
