import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "QR Scanner",
  description:
    "QR Scanner online - Scan QR codes with your camera or upload images",
  creator: "Diego Ivan Perea Montealegre",
  icons: {
    icon: "./icon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
