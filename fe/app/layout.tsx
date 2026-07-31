import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quietly | Personal Book Manager",
  description: "A calm space to keep track of the books you want to read.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
