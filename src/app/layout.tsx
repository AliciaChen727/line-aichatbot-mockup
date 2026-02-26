import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LINE AI Chatbot",
  description: "A beautiful mockup for a LINE AI Chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
